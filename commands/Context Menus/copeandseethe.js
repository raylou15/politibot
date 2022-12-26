const {
  SlashCommandBuilder,
  ContextMenuCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Embed,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Cope and Seethe")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  /**
   *
   * @param {ContextMenuCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const targetMsg = await interaction.channel.messages.fetch(
      interaction.targetId
    );

    interaction.reply({
      content: "Thanks for sending this embed to the moron",
      ephemeral: true,
    });
    targetMsg.reply({
      content:
        "https://tenor.com/view/cope-cope-harder-seethe-cope-and-seethe-penguins-of-madagascar-gif-23735093",
    });
  },
};
