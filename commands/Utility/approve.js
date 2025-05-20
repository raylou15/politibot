const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("approve")
    .setDescription("Manual verification command.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("User to approve!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser("target");
    const targetMember = interaction.guild.members.cache.get(targetUser.id);
    const logChannel =
      interaction.guild.channels.cache.get("776527984147693589");
    const unverifiedRole =
      interaction.guild.roles.cache.get("909988798308433920");
    const verifiedRole =
      interaction.guild.roles.cache.get("909989200378601472");

    if (
      targetMember.roles.cache.has("909988798308433920") &&
      !targetMember.roles.cache.has("909989200378601472")
    ) {
      await targetMember.roles.add(verifiedRole);
      await targetMember.roles.remove(unverifiedRole);
      return interaction.reply({
        content: `✅  User ${targetUser} has been approved!`,
      });
    } else {
      return interaction.reply({
        content: "✅  This user has already been approved!",
      });
    }
  },
});
