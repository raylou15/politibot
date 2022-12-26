const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report something happening in the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("reason")
        .setDescription("What are you reporting? Provide a link!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const bookmark = await interaction.channel.send("🔖");
    const reason = interaction.options.getString("reason");

    const reportEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("Red")
      .setTitle("**Message Reported**")
      .setDescription("Report filed with `/report` by " + `${interaction.user}`)
      .addFields(
        { name: "Reason:", value: reason },
        {
          name: "Timestamp:",
          value:
            `Reported in ${interaction.channel.toString()} at:` +
            "`" +
            `\n${interaction.createdAt}` +
            "`" +
            `\n\n[Jump to Bookmark](${bookmark.url})`,
        }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setTimestamp();

    const modChannel =
      interaction.guild.channels.cache.get("893189759474757693");

    modChannel.send({
      content:
        "<@178689418415177729> <@&893189360105689139> <@&854841000480079882> <@&927318500614225920> **See below complaint:**",
      embeds: [reportEmbed],
    });
    interaction.reply({
      content:
        "A report has been sent! We prefer you use other methods, such as opening a ticket or using the Context Menu (right click msg -> Apps -> Report Message), but this will work too! Thanks for helping keep the server tidy.",
      ephemeral: true,
    });
  },
};
