const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const CaseCountSchema = require("../../schemas/casecount");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("Provide a channel!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    if (!channel) {
      return interaction.reply({
        content: "There is no channel selected.",
        ephemeral: true,
      });
    } else {
      channel.lockPermissions();
      channel.send("This channel has been unlocked. Please behave.");
      interaction.reply({
        content: `${channel} has been unlocked.`,
        ephemeral: true,
      });
    }
  },
};
