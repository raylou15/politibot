const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "resolvereport",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const message = interaction.message
        const embed = message.embeds[0]
        const regex = /<@(\d+)>/;

        const claimedModID = embed.fields[1].value.match(regex)
        const claimedMod = interaction.guild.members.cache.get(claimedModID[1])

        if (interaction.user !== claimedMod.user) {
            return interaction.reply({ephemeral: true, content: "This is not your report."})
        }

        const newEmbed = new EmbedBuilder()
        .setAuthor(embed.author)
        .setTitle("✅  Resolved Message Report")
        .setColor(embed.color)
        .setDescription(embed.description)
        .addFields(
            {name: embed.fields[0].name, value: embed.fields[0].value, inline: true},
            {name: embed.fields[1].name, value: `Resolved by ${interaction.user}`, inline: true},
            {name: embed.fields[2].name, value: embed.fields[2].value}
        )
        .setFooter({ text: `This report has been resolved.` })

        const resolvedEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription("Your report from earlier has been marked as resolved by a Moderator.")
        .setFooter({ text: "If you have any questions, please reach out to us with /openticket if one is not already open"})


        interaction.message.edit({ embeds: [newEmbed], components: [] })

        const match = embed.description.match(regex)
        const targetUser = interaction.guild.members.cache.get(match[1]).user

        targetUser.send({ embeds: [resolvedEmbed] }).catch((err) => {
            console.log(err);
        })
        
    },
  };
  
