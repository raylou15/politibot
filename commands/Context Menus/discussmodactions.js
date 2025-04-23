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
    .setName("Discussing Mod Action")
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
    const targetUser = await targetMsg.author;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("⚠️  Discussing Moderator Actions in Public Channels")
      .setDescription(`Hey there, ${targetUser.toString()}! [This message](${targetMsg.url}) is likely related to trying to discuss moderator action in some way or another. In Operation Politics, we try to avoid discussions about ANY form of moderator action in any public channels whatsoever. The reason for this is that it clutters up channels, distracts from conversations, and often is used as a way to needlessly create animosity towards our staff members for simply doing their job and upholding the rules. \n\nIf you have questions about the rules, their application, or any moderator action that has occurred (whether it happened to you or not), you can feel free to <#999439440273473657> and bring your concerns directly to us, and we will be happy to openly and transparently talk with you about your issues. \n\n**However, at the end of the day, discussion of moderator action is not permissible in public channels.**`)
      .setFooter({text: "DMing moderators or staff regarding moderator actions are not permissible either — please use the official method described above. Discussion of moderator action beyond this point will get you muted."})

    interaction.reply({
      ephemeral: true,
      content: "Embed Reminder Sent"
    })

    targetMsg.reply({
      embeds: [embed]
    });
  },
};
