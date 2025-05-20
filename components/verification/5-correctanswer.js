const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
  MessageFlags
} = require("discord.js");
const verifyData = require("../../schemas/verificationdata");
module.exports = {
  name: "correct",
  description: "agree to policy",
  /**
   *
   * @param {SelectMenuInteraction} interaction
   */
  async execute(interaction) {
    const finalEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Agree to our Rules")
      .setDescription(
        `To continue, you must agree to the following:\n\n• *You have read the server rules and agree to follow them*\n• *We have a new member no-tolerance policy, which means until you gain "Trusted Member" status, you can be banned upon your first major infraction.*\n• *Trusted Member status is granted at 300 messages and 2 weeks of participation.*`
      )
      .setFooter({
        text: `If you agree to and understand the above, hit "Confirm" below.`,
      })
      .setThumbnail("https://i.imgur.com/kcdKk1U.png");

    const finalRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setStyle(ButtonStyle.Success)
    );

    interaction.update({
      embeds: [finalEmbed],
      components: [finalRow],
      flags: [MessageFlags.Ephemeral],
    });
  },
};
