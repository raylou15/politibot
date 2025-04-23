const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "claimticket",
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
        const targetUser = client.users.cache.find(u => u.username === targetDiscrim)
        const ticketsChannel = interaction.guild.channels.cache.get(config.ticketParent)

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
            new ButtonBuilder()
                .setCustomId('takeover')
                .setLabel('❗')
                .setStyle(ButtonStyle.Secondary)
        )

        await interaction.reply({ embeds: [claimedEmbed]})
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

        console.log(targetUser)

        await targetUser.send({ embeds: [claimedEmbed2] }).catch(async (err) => {
            console.log(err);
            message.react('<:crossmark:965445798630416434>')
            return logChannel.send({
                content:
                "Could not send DM. User may have left server.",
            });
        });

    },
  };
  
