const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

const ticketHandler = require("../../handlers/tickethandler");
const blacklistData = require("../../schemas/ticketblacklist");

const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("openticket")
    .setDescription("Open a ticket to contact Server Staff"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    // Check if user already has an open ticket
    const hasOpenTicket = await ticketHandler.TicketChecker(client, interaction);
    console.log("TicketChecker:", hasOpenTicket);

    if (hasOpenTicket === true) {
      return interaction.reply({
        content: "You already have a ticket open. Reply in your DMs to the Politibot.",
        flags: [MessageFlags.Ephemeral],
      });
    }

    // Check if user is blacklisted
    const foundData = await blacklistData.findOne({ UserID: interaction.user.id });
    console.log("Blacklist status:", foundData ? "Blacklisted" : "Not blacklisted");

    if (foundData) {
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "You have been blacklisted from using the Modmail System.",
      });
    }

    // Embed for users who don't have DMs open
    const dmErrorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) — your settings must be set to 'everyone'."
      );

    // Main ticket embed
    const firstEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("📨  Operation Politics Modmail System")
      .setDescription(
        [
          "-# Please choose the appropriate category below. Choosing an incorrect category may lead to delayed or insufficient responses.",
          "‣ **⚖️  Appeals** are for appealing Moderation Action of any kind. This will put you in touch with our senior staff, who can handle your appeals properly.",
          "‣ **🔨  Moderation** is for reporting rule violations, asking about the rules, and general server inquiries. This will put you in touch with our moderation team.",
          "‣ **🤖  Bot Support** is to report issues with the bot, or to provide suggestions or comments about the bot's functionality. This will put you in touch with our bot developer.",
          "‣ **🤝  Partnerships** is to get access to our <#888789135261859851> channel. This will put you in touch with our partnership manager.",
          "‣ **❔  Other** is for anything that doesn’t fit the categories above. **DO NOT USE THIS FOR REPORTS, APPEALS, OR SUGGESTIONS.**",
          "**-# Abusing the Modmail System can and will result in blacklisting.**",
        ].join("\n\n")
      );

    const buttonsRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("appeals")
        .setLabel("Appeals")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⚖️"),
      new ButtonBuilder()
        .setCustomId("moderation")
        .setLabel("Moderation")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔨"),
      new ButtonBuilder()
        .setCustomId("bot support")
        .setLabel("Bot Support")
        .setStyle(ButtonStyle.Success)
        .setEmoji("🤖"),
      new ButtonBuilder()
        .setCustomId("partnerships")
        .setLabel("Partnerships")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🤝"),
      new ButtonBuilder()
        .setCustomId("other")
        .setLabel("Other")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("❔")
    );

    // Try sending the DM
    const dmSent = await interaction.user
      .send({ embeds: [firstEmbed], components: [buttonsRow] })
      .catch(async (err) => {
        console.warn("❌ Could not DM user:", err.message);
        await interaction.reply({ embeds: [dmErrorEmbed], flags: [MessageFlags.Ephemeral] });
        return false;
      });

    // If DM worked, respond in server
    if (dmSent !== false) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "✅ Check your DMs to proceed further!",
          flags: [MessageFlags.Ephemeral],
        });
      } else {
        await interaction.followUp({
          content: "✅ Check your DMs to proceed further!",
          flags: [MessageFlags.Ephemeral],
        });
      }
    }
  },
});
