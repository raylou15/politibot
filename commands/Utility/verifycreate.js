const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verifycreater")
    .setDescription("Creates the button for verification.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("channel to post buttons in")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const targetChannel = interaction.options.getChannel("channel");
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verifybutton")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("faqbutton")
        .setLabel("FAQ")
        .setStyle(ButtonStyle.Secondary)
    );

    const buttonembed = new EmbedBuilder()
      .setTitle("Welcome to Operation Politics!")
      .setColor("White")
      .setDescription(
        "In order to get full access to the server, you must complete a simple verification process. This is short and painless!\n\n• Click on `Verify` to get started\n• Click on `FAQ` to learn more about the server"
      )
      .setFooter({
        text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━",
      })
      .setThumbnail("https://i.imgur.com/kcdKk1U.png");

    interaction.reply({ content: "thanks", flags: [MessageFlags.Ephemeral] });
    targetChannel.send({ embeds: [buttonembed], components: [buttonRow] });
  },
};
