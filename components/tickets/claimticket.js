const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "claimticket",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const nameArgs = interaction.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)
        
        const claimedEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`This ticket has been claimed by ${interaction.user}!`)

        const claimedEmbed2 = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Your ticket has been claimed and is now being reviewed.")
        
        const claimedButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('unclaimticket')
                .setLabel('Unclaim Ticket')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('closeticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger),
        )

        await interaction.reply({ embeds: [claimedEmbed]})
        await targetUser.send({ embeds: [claimedEmbed2] })
        interaction.message.edit({ components: [claimedButtons] })


    },
  };
  
