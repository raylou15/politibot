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
    .setName("Politics In General Channel")
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
      .setTitle("⚠️  Discussing Politics in General")
      .setDescription(`Hey there, ${targetUser.toString()}! You should avert your eyes to the top of your screen and tap the name of the channel, where you will be prompted with a channel description. Each channel in this server has one of these, and they tell you what each channel is used for. \n\nOnce you do this, you will realize that this channel is NOT a political channel, and that [this message](${targetMsg.url}) is therefore in violation of Rule 7. \n\nWe have over two dozen channels dedicated to politics and political discussion, and one channel dedicated to purely nonpolitical discussion. Please respect that - it's been that way for many years here. We find that we have better dialogue, communication, and debates when people have a reason to get together and chat casually outside of the toxicity of politics. \n\nPlease move channels, or you are liable to be muted.`)
      .setFooter({text: "Discussion of politics beyond this point, or arguing with this rule, will get you muted."})

    interaction.reply({
      ephemeral: true,
      content: "Embed Reminder Sent"
    })

    targetMsg.reply({
      embeds: [embed]
    });
  },
};
