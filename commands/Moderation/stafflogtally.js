// commands/stafflogtally.js
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

const infractionData = require("../../schemas/infractions"); // your schema (IssuerID, TargetID, InfractionType, Date, etc.)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stafflogtally")
    .setDescription("Show last 30 days of moderator actions, per issuer, with type breakdowns.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: false });

    // Make sure we have a fresh member/role cache
    await interaction.guild.members.fetch();
    await interaction.guild.roles.fetch();

    // --- Collect current staff in the three roles (by name) ---
    const roleNames = ["Moderator", "Trial Moderator", "Senior Moderator"];
    const staffIds = new Set();

    for (const name of roleNames) {
      const role = interaction.guild.roles.cache.find(r => r.name === name);
      if (role) {
        for (const [id] of role.members) staffIds.add(id);
      }
    }

    // --- Time window: last 30 days ---
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // --- Aggregate infractions by IssuerID over last 30 days ---
    // Produces: [{ userId, total, byType: { Warn: 3, "Voice Mute": 1, ... } }, ...]
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

    // Index current aggregates by IssuerID for quick lookups
    const byIssuer = new Map(aggregated.map(r => [String(r.userId), r]));

    // Ensure all current moderators appear, even with zero
    for (const id of staffIds) {
      const key = String(id);
      if (!byIssuer.has(key)) {
        byIssuer.set(key, { userId: key, total: 0, byType: {} });
      }
    }

    // Optionally, you can restrict output to staff only.
    // If you want all issuers (including non-staff) keep as-is.
    // If you want only current staff, uncomment the following:
    // for (const key of Array.from(byIssuer.keys())) {
    //   if (!staffIds.has(key)) byIssuer.delete(key);
    // }

    // Sort: most logs to least; tie-breaker = display name / id
    const members = interaction.guild.members.cache;
    const sorted = Array.from(byIssuer.values()).sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      const an = members.get(a.userId)?.displayName ?? a.userId;
      const bn = members.get(b.userId)?.displayName ?? b.userId;
      return an.localeCompare(bn);
    });

    if (!sorted.length) {
      return interaction.editReply("No moderator actions found in the last 30 days.");
    }

    // Build lines like:
    // <@123> — 7 total | Warn: 4, Mute: 2, Kick: 1
    const lines = sorted.map((r) => {
      const member = members.get(r.userId);
      const label = member ? `${member.toString()} (${member.displayName})` : `Left server (${r.userId})`;
      const byTypeStr = Object.entries(r.byType)
        .sort((a, b) => b[1] - a[1])
        .map(([t, c]) => `${t}: ${c}`)
        .join(", ");
      const breakdown = byTypeStr.length ? ` | ${byTypeStr}` : "";
      return `${label} — **${r.total}** total${breakdown}`;
    });

    // Discord limit safety – put up to ~25 lines in one embed to be safe
    const MAX_LINES = 25;
    const shown = lines.slice(0, MAX_LINES);
    const truncated = lines.length > MAX_LINES;

    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Moderator Actions — Last 30 Days (by Issuer)")
      .setDescription(shown.join("\n"))
      .setFooter({
        text: truncated
          ? `Showing top ${MAX_LINES} of ${lines.length} moderators/issuers`
          : `Total moderators/issuers: ${lines.length}`,
      })
      .setTimestamp(new Date());

    await interaction.editReply({ embeds: [embed] });
  },
};
