const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Send a message to a channel through the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addChannelOption((options) =>
      options
        .setName("channel")
        .setDescription("Channel to send the message.")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    const sendmessage = interaction.options.getString("message");

    const sentmsg = channel.send(sendmessage);
    const replyEmbed = new EmbedBuilder().setDescription(
      `[Sent your message](${sentmsg.link})`
    );
    interaction.reply({ embeds: [replyEmbed], ephemeral: true });
  },
};
