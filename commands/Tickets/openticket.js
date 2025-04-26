const {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketHandler = require("../../handlers/tickethandler");
const blacklistData = require("../../schemas/ticketblacklist");
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("openticket")
    .setDescription("Open a ticket to contact Server Staff"),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        let truefalseVal = ticketHandler.TicketChecker(client, interaction)
        console.log(truefalseVal)

        if (truefalseVal === 'true') {
            return interaction.reply({ content: "You already have a ticket open. Reply in your DMs to the Politibot.", ephemeral: true })
        }

        const dmErrorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) - your settings must be set to 'everyone'");
        
        const firstEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("Operation Politics Modmail System")
        .setDescription("Please choose the appropriate category below. \n\n‣ **⚖️ Appeals** are for appealing Moderation Action of any kind. This will put you in touch with our senior staff, who can handle your appeals properly. Please use this if you need to report a staff member, as well. \n\n‣ **🔨 Moderation** is for reporting rule violation, asking about the rules, and general server inquiries. This will put you in touch with our moderation team. \n\n‣ **🤖 Bot Support** is to report issues with the bot, or to provide suggestions or comments about the bot's functionality. This will put you in touch with our bot developer. \n\n‣ **🤝 Partnerships** is to get access to our <#888789135261859851> channel. This will put you in touch with our partnership manager. \n\n‣ **❔ Other** is for anything that you aren't sure if it fits under one of the previous categories.\n\n\n**Please note that abusing the Modmail System in any way can and will get you blocked from using the system.**")

        const buttonsRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('appeals').setLabel('Appeals').setStyle(ButtonStyle.Primary).setEmoji('⚖️'),
            new ButtonBuilder().setCustomId('moderation').setLabel('Moderation').setStyle(ButtonStyle.Danger).setEmoji('🔨'),
            new ButtonBuilder().setCustomId('bot support').setLabel('Bot Support').setStyle(ButtonStyle.Success).setEmoji('🤖'),
            new ButtonBuilder().setCustomId('partnerships').setLabel('Partnerships').setStyle(ButtonStyle.Primary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('other').setLabel('Other').setStyle(ButtonStyle.Secondary).setEmoji('❔')
        );

        const foundData = await blacklistData.findOne({ UserID: interaction.user.id })

        console.log(foundData)

        if (foundData) {
            return interaction.reply({ ephemeral: true, content: "You have been blacklisted from using the Modmail System." })
        } else {
            console.log("Not blacklisted")
        }

        await interaction.user.send({ embeds: [firstEmbed], components: [buttonsRow] }).catch(async (err) => {
            console.log(err);
            return interaction.reply({ embeds: [dmErrorEmbed], ephemeral: true });
        });

        await interaction.reply({ content: "Check your DMs to proceed further!", ephemeral: true})

    },
  });
  