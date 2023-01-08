const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const ticketHandler = require("../../handlers/tickethandler");
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
            return interaction.reply({ content: "You already have a ticket open. Reply in your DMs to the Politibot.", ephemeral: true })
        }

        const dmErrorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) - your settings must be set to 'everyone'");
        
        const firstEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("Operation Politics Modmail System")
        .setDescription("Please choose the appropriate category below.\n\n`Appeals` are for appealing Moderation Action, `Moderation` is for reporting things or rule inquiries, `Bot Support` is for suggestions or inquiries about the bot, `Partnerships` is to get access to our <#888789135261859851> channel, and `Other` is for everything else.\n\nPlease be wary that abusing this system **will get you blocked**.");

        const buttonsRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('appeals').setLabel('Appeals').setStyle(ButtonStyle.Primary).setEmoji('⚖️'),
            new ButtonBuilder().setCustomId('moderation').setLabel('Moderation').setStyle(ButtonStyle.Danger).setEmoji('🔨'),
            new ButtonBuilder().setCustomId('botsupport').setLabel('Bot Support').setStyle(ButtonStyle.Success).setEmoji('🤖'),
            new ButtonBuilder().setCustomId('partnerships').setLabel('Partnerships').setStyle(ButtonStyle.Primary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('otherhelp').setLabel('Other').setStyle(ButtonStyle.Secondary).setEmoji('❔')
        );

        await interaction.user.send({ embeds: [firstEmbed], components: [buttonsRow] }).catch(async (err) => {
            console.log(err);
            return interaction.reply({ embeds: [dmErrorEmbed], ephemeral: true });
        });

        await interaction.reply({ content: "Check your DMs to proceed further!", ephemeral: true})

    },
  };
  
