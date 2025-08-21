// commands/stafflogtally.js
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

const infractionData = require("../../schemas/infractions"); // (IssuerID, TargetID, InfractionType, Date, ...)

const typeDisplay = {
    "Rule Reminder": "Reminder",
    // add more aliases if needed later
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stafflogtally")
        .setDescription("Show moderator actions (per issuer) with type breakdowns.")
        .addIntegerOption(opt =>
            opt
                .setName("days")
                .setDescription("How many days back to look (default 30).")
                .setMinValue(1)
                .setMaxValue(365)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        // Refresh caches
        await interaction.guild.members.fetch();
        await interaction.guild.roles.fetch();

        // --- Current staff set (by role name) ---
        const roleNames = ["Moderator", "Trial Moderator", "Senior Moderator"];
        const staffIds = new Set();
        for (const name of roleNames) {
            const role = interaction.guild.roles.cache.find((r) => r.name === name);
            if (role) for (const [id] of role.members) staffIds.add(id);
        }

        // --- Time window (default 30 days) ---
        const days = interaction.options.getInteger("days") ?? 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // --- Aggregate infractions by IssuerID over window ---
        const aggregated = await infractionData.aggregate([
            { $match: { Date: { $gte: since } } },
            {
                $group: {
                    _id: { issuer: "$IssuerID", type: "$InfractionType" },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.issuer",
                    total: { $sum: "$count" },
                    byType: { $push: { k: "$_id.type", v: "$count" } },
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    total: 1,
                    byType: { $arrayToObject: "$byType" },
                },
            },
            { $sort: { total: -1 } },
        ]);

        // Index aggregates
        const byIssuer = new Map(aggregated.map((r) => [String(r.userId), r]));

        // Ensure current staff are present (even with zero)
        for (const id of staffIds) {
            const key = String(id);
            if (!byIssuer.has(key)) byIssuer.set(key, { userId: key, total: 0, byType: {} });
        }

        const members = interaction.guild.members.cache;

        // If absolutely no issuers nor staff found
        if (byIssuer.size === 0) {
            return interaction.editReply(`No moderators found (roles: ${roleNames.join(", ")}).`);
        }

        // Sort by total desc, tie-break by display name
        const sorted = Array.from(byIssuer.values()).sort((a, b) => {
            if (b.total !== a.total) return b.total - a.total;
            const an = members.get(a.userId)?.displayName ?? a.userId;
            const bn = members.get(b.userId)?.displayName ?? b.userId;
            return an.localeCompare(bn);
        });

        // Build neat inline fields (grid-friendly)
        const fields = sorted.map((r) => {
            const member = members.get(r.userId);
            const header = member ? `${member.displayName}` : `❌ Left server`;
            const mentionOrId = member ? `<@${r.userId}>` : `(${r.userId})`;

            const byTypeStr = Object.entries(r.byType)
                .sort((a, b) => b[1] - a[1])
                .map(([t, c]) => {
                    const display = typeDisplay[t] ?? t;
                    return `• **${display}**: ${c}`;
                })
                .join("\n");

            return {
                name: header,
                value:
                    `${mentionOrId}\n` +
                    (byTypeStr.length ? `${byTypeStr}\n**Total:** ${r.total}` : `_No actions_\n**Total:** ${r.total}`),
                inline: true,
            };
        });

        // Cap to top 25; note if truncated
        const MAX_FIELDS = 25;
        const shownFields = fields.slice(0, MAX_FIELDS);
        const truncated = fields.length > MAX_FIELDS;

        const embed = new EmbedBuilder()
            .setColor(0x5865f2)
            .setTitle(`📊 Moderator Actions — Last ${days} Day${days === 1 ? "" : "s"}`)
            .setDescription(
                "Issuers include current **Moderator**, **Trial Moderator**, and **Senior Moderator** roles. " +
                "Sorted by total actions."
            )
            .addFields(shownFields)
            .setFooter({
                text: `${truncated ? `Showing top ${MAX_FIELDS} of ${fields.length}. ` : ""}Window since ${since.toLocaleDateString()}`,
            })
            .setTimestamp(new Date());

        await interaction.editReply({ embeds: [embed] });
    },
};
