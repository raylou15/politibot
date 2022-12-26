const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlockdown")
    .setDescription("Unlocks a bunch of channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const discCat = await interaction.guild.channels.fetch(
      "760275642150420521"
    );
    const commCat = await interaction.guild.channels.fetch(
      "775559863522164737"
    );
    await discCat.permissionOverwrites.create(discCat.guild.roles.everyone, {
      SendMessages: null,
    });
    await commCat.permissionOverwrites.create(commCat.guild.roles.everyone, {
      SendMessages: null,
    });

    interaction.reply({ content: "Unlockdown successful!", ephemeral: true });
  },
};
