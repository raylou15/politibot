const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  IntentsBitField,
  MessageFlags
} = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "unclaimticket",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const mainchannel = interaction.channel
        const mainEmbed = interaction.message.embeds[0]
        const nameArgs = mainchannel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        let targetUser = client.users.cache.find(u => u.username === targetDiscrim);

        if (!targetUser) {
            try {
                const guildMembers = await interaction.guild.members.fetch();
                targetUser = guildMembers.find(m => m.user.username === targetDiscrim)?.user;
            } catch (err) {
                console.error("❌ Failed to find target user:", err);
            }
        }

        const ticketsChannel = interaction.guild.channels.cache.get(config.ticketParent)

        const claimField = mainEmbed?.fields?.[2]?.value ?? "N/A";
        if (`<@${interaction.user.id}>` !== claimField) {
            return interaction.reply({ content: "This is not your ticket!", flags: [MessageFlags.Ephemeral] });
        }

        const newEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('New Ticket Opened')
            .setAuthor(mainEmbed.author)
            .setDescription(mainEmbed.description)
            .setFields([
                { name: mainEmbed.fields[0].name, value: mainEmbed.fields[0].value },
                { name: mainEmbed.fields[1].name, value: mainEmbed.fields[1].value, inline: true },
                { name: mainEmbed.fields[2].name, value: `N/A`, inline: true }
            ])
            .setFooter({ text: "Please claim the ticket before proceeding." });

        const claimedEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`This ticket has been unclaimed by ${interaction.user}!`)

        const claimedEmbed2 = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Your ticket has been unclaimed and is now awaiting a new staff member.")

        const claimedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('claimticket')
                .setLabel('Claim Ticket')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('closeticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('takeover')
                .setLabel('❗')
                .setStyle(ButtonStyle.Secondary)
        )

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ embeds: [claimedEmbed] });
        } else {
            await interaction.followUp({ embeds: [claimedEmbed], flags: [MessageFlags.Ephemeral] });
        }
        await interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })

        console.log(targetUser)
        if (targetUser) {
            await targetUser.send({ embeds: [claimedEmbed2] }).catch(async (err) => {
                console.warn("⚠️ Could not DM user:", err.message);
            });
        } else {
            console.warn("⚠️ targetUser is undefined — DM not sent.");
        }


        const tagArray = [];

        const categoryTag = mainEmbed?.fields?.[0]?.value?.toLowerCase();
        ticketsChannel.availableTags.forEach(element => {
            if (categoryTag && element.name.toLowerCase() === categoryTag) {
                tagArray.push(element.id);
            }
            if (element.name.toLowerCase() === "unclaimed") {
                tagArray.push(element.id);
            }
        });

        mainchannel.setAppliedTags(tagArray)

    },
};

