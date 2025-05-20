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
const ticketHandler = require("../../handlers/tickethandler");
const blacklistData = require("../../schemas/ticketblacklist");
const client = module.exports = {
    name: "openaticket",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        let truefalseVal = ticketHandler.TicketChecker(client, interaction)
        console.log(truefalseVal)

        if (truefalseVal === 'true') {
            return interaction.reply({ content: "You already have a ticket open. Reply in your DMs to the Politibot.", flags: [MessageFlags.Ephemeral] })
        }

        const foundData = await blacklistData.findOne({ UserID: interaction.user.id })

        console.log(foundData)

        if (foundData) {
            return interaction.reply({ flags: [MessageFlags.Ephemeral], content: "You have been blacklisted from using the Modmail System." })
        } else {
            console.log("Not blacklisted")
        }

        const dmErrorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) - your settings must be set to 'everyone'");
        
        const firstEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("📨  Operation Politics Modmail System")
        .setDescription([
            "-# Please choose the appropriate category below. Choosing an incorrect category may lead to delayed or insufficient responses.",
            "‣ **⚖️  Appeals** are for appealing Moderation Action of any kind. This will put you in touch with our senior staff, who can handle your appeals properly.",
            "‣ **🔨  Moderation** is for reporting rule violation, asking about the rules, and general server inquiries. This will put you in touch with our moderation team.",
            "‣ **🤖  Bot Support** is to report issues with the bot, or to provide suggestions or comments about the bot's functionality. This will put you in touch with our bot developer.",
            "‣ **🤝  Partnerships** is to get access to our <#888789135261859851> channel. This will put you in touch with our partnership manager.",
            "‣ **❔  Other** is for anything that you aren't sure if it fits under one of the previous categories. **DO NOT USE THIS FOR REPORTS, APPEALS, OR SUGGESTIONS.**",
            "**-# Please note that abusing the Modmail System in any way can and will get you blocked from using the system.**"
            ].join("\n\n")
        )
        const buttonsRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('appeals').setLabel('Appeals').setStyle(ButtonStyle.Primary).setEmoji('⚖️'),
            new ButtonBuilder().setCustomId('moderation').setLabel('Moderation').setStyle(ButtonStyle.Danger).setEmoji('🔨'),
            new ButtonBuilder().setCustomId('bot support').setLabel('Bot Support').setStyle(ButtonStyle.Success).setEmoji('🤖'),
            new ButtonBuilder().setCustomId('partnerships').setLabel('Partnerships').setStyle(ButtonStyle.Primary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('other').setLabel('Other').setStyle(ButtonStyle.Secondary).setEmoji('❔')
        );

        await interaction.user.send({ embeds: [firstEmbed], components: [buttonsRow] }).catch(async (err) => {
            console.log(err);
            return interaction.reply({ embeds: [dmErrorEmbed], flags: [MessageFlags.Ephemeral] });
        });

        await interaction.reply({ content: "Check your DMs to proceed further!", flags: [MessageFlags.Ephemeral]})

    },
  };
  
