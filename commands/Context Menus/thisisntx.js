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
    .setName("This isnt X")
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
    const thisisntXEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle(`⚠️ "This isn't x, y, or z..."`)
      .setDescription(
        "I don't really care. You were told to stop talking about `x` in your specific channel. Whether it's related to politics, philosophy, religion, news, random policy, or anything else, if you were told 'no x in this channel', then don't argue. We don't want to hear it, and you're just being annoying. \n\n**Move to the appropriate channel, or stop talking.**"
      )
      .setFooter({
        text: "Non-negotiable. Further argumentative attitude will get you muted.",
      });

    interaction.reply({
      content: "Thanks for sending this embed to the moron",
      ephemeral: true,
    });
    targetMsg.reply({ embeds: [thisisntXEmbed] });
  },
};
