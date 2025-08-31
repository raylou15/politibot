const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purgechannels")
    .setDescription("Delete channels without a parent category.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (interaction.guild.id !== "1411543631755481140") {
      return interaction.reply({
        content: "This command can only be used in the specified server.",
        flags: [MessageFlags.Ephemeral],
      });
    }

    const channels = interaction.guild.channels.cache.filter(
      (channel) => channel.parent === null && channel.type !== ChannelType.GuildCategory
    );

    let deletedCount = 0;
    for (const channel of channels.values()) {
      try {
        await channel.delete("No parent category");
        deletedCount++;
      } catch (err) {
        console.log(`Failed to delete channel ${channel.id}:`, err);
      }
    }

    return interaction.reply({
      content: `Deleted ${deletedCount} channel${deletedCount !== 1 ? "s" : ""} with no parent category.`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};

