const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "claimreport",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const message = interaction.message
        const embed = message.embeds[0]

        const newEmbed = new EmbedBuilder()
        .setAuthor(embed.author)
        .setTitle(embed.title)
        .setColor(embed.color)
        .setDescription(embed.description)
        .addFields(
            {name: embed.fields[0].name, value: embed.fields[0].value, inline: true},
            {name: embed.fields[1].name, value: `${interaction.user}`, inline: true},
            {name: embed.fields[2].name, value: embed.fields[2].value}
        )
        .setFooter({ text: `This report has been claimed. You can use "Contact" below to open a ticket with the person who filed the report.` })

        const claimedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('unclaimreport')
            .setLabel("Unclaim")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("contactreport")
            .setLabel("Contact")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("takeoverreport")
            .setLabel("❗")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("resolvereport")
            .setLabel("✅")
            .setStyle(ButtonStyle.Success),
        )

        interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })
        interaction.reply({ephemeral: true, content: "Claimed report."})
        
    },
  };
  
