const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "takeoverreport",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const message = interaction.message
        const embed = message.embeds[0]
        const regex = /<@(\d+)>/;

        if (embed.fields[1].value === "N/A") {
            return interaction.reply({ephemeral: true, content: "This is not claimed by anyone."})
        }

        const claimedModID = embed.fields[1].value.match(regex)
        const claimedMod = await interaction.guild.members.fetch(claimedModID[1])

        if (interaction.user === claimedMod.user) {
            return interaction.reply({ephemeral: true, content: "This is already claimed by you."})
        }

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

        const takeoverEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(`This report has been taken over by ${interaction.user}`)

        interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })
        interaction.reply({ content: embed.fields[1].value, embeds: [takeoverEmbed] })
        
    },
  };
  
