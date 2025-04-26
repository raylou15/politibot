const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "unclaimreport",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const message = interaction.message
        const embed = message.embeds[0]
        const regex = /<@(\d+)>/;

        const claimedModID = embed.fields[1].value.match(regex)
        const claimedMod = await interaction.guild.members.fetch(claimedModID[1])

        if (interaction.user !== claimedMod.user) {
            return interaction.reply({ephemeral: true, content: "This is not your report."})
        }

        const newEmbed = new EmbedBuilder()
        .setAuthor(embed.author)
        .setTitle(embed.title)
        .setColor(embed.color)
        .setDescription(embed.description)
        .addFields(
            {name: embed.fields[0].name, value: embed.fields[0].value, inline: true},
            {name: embed.fields[1].name, value: `N/A`, inline: true},
            {name: embed.fields[2].name, value: embed.fields[2].value}
        )
        .setFooter({ text: `Please claim this report before proceeding. You can use "Contact" below to open a ticket with the person who filed the report.` })

        const claimedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('claimreport')
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("contactreport")
            .setLabel("Contact")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("takeoverreport")
            .setLabel("❗")
            .setStyle(ButtonStyle.Secondary),
        )

        interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })
        interaction.reply({ephemeral: true, content: "Unclaimed report."})
        
    },
  };
  
