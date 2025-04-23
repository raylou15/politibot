const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "takeover",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        if (interaction.member.roles.cache.some(role => role.name === 'Senior Moderator') || interaction.member.roles.cache.some(role => role.name === 'Management')) {

            const mainchannel = interaction.channel
            const mainEmbed = interaction.message.embeds[0]
            const nameArgs = mainchannel.name.split("-")
            const targetDiscrim1 = `${nameArgs[0]}`
            const targetDiscrim = targetDiscrim1.replace("_", " ")
            const targetUser = client.users.cache.find(u => u.username === targetDiscrim)
            const ticketsChannel = interaction.guild.channels.cache.get(config.ticketParent)

            if (mainEmbed.fields[2].value === "N/A") {
                return interaction.reply({ ephemeral: true, content: 'This ticket is not currently claimed by anybody, so you cannot override it.' })
            }

            await interaction.message.pin()

            const newEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('New Ticket Opened')
            .setAuthor(mainEmbed.author)
            .setDescription(mainEmbed.description)
            .setFields([
                { name: mainEmbed.fields[0].name, value: mainEmbed.fields[0].value },
                { name: mainEmbed.fields[1].name, value: mainEmbed.fields[1].value, inline: true },
                { name: mainEmbed.fields[2].name, value: `${interaction.user}`, inline: true }
            ])
            .setFooter({ text: "This ticket has been claimed."});
            
            const claimedEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`This ticket has been overridden by ${interaction.user}!`)

            const claimedEmbed2 = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription("Your ticket has been re-claimed by a senior member of our staff.")
            
            const claimedButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('unclaimticket')
                    .setLabel('Unclaim Ticket')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('closeticket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('takeover')
                    .setLabel('❗')
                    .setStyle(ButtonStyle.Secondary)
            )

            await interaction.reply({ embeds: [claimedEmbed]})
            await targetUser.send({ embeds: [claimedEmbed2] })
            await interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] })
            
            const tagArray = [];

            ticketsChannel.availableTags.forEach(element => {
                if (element.name.toLowerCase() === `${mainEmbed.fields[0].value.toLowerCase()}`) {
                    tagArray.push(element.id)
                }
                if (element.name.toLowerCase() === `claimed`) {
                    tagArray.push(element.id)
                }
            })

            mainchannel.setAppliedTags(tagArray)

        } else (
            interaction.reply({ ephemeral: true, content: "Only Senior Moderators or Management can override a claimed ticket." })
        )

    },
  };
  
