const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
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
        const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)

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
        .setFooter({ text: "Please claim the ticket before proceeding."});
        
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
        )

        await interaction.reply({ embeds: [claimedEmbed]})
        await targetUser.send({ embeds: [claimedEmbed2] })
        await interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })
        
        const tags = mainchannel.appliedTags

    },
  };
  
