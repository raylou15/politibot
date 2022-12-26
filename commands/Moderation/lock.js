const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel.")
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
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        SendMessages: false,
      });
      channel.send(
        "This channel has been locked by a Moderator. This is likely so they can review recent conversations — this is not a green light to continue the discussion in other channels."
      );
      interaction.reply({
        content: `${channel} has been locked.`,
        ephemeral: true,
      });
    }
  },
};
