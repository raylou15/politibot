const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  time
} = require("discord.js");
const ms = require("ms");
const date = new Date();

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
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor("Red")
    .setTitle("Message Reported")
    .setDescription(`A report has been filed by ${interaction.user}:`)
    .addFields(
      {
        name: "Reason",
        value: reason,
        inline: true
      },
      {
        name: "Claimed by:",
        value: "N/A",
        inline: true
      },
      {
        name: "Information",
        value: `Reported in ${interaction.channel.toString()} with ` + '`/report`' + ` ${time(date, 'R')} \n[Jump to Bookmark](${bookmark.url})`
      }
    )
    .setFooter({ text: `Please claim this report before proceeding. You can use "Contact" below to open a ticket with the person who filed the report.` });

    const reportButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('claimreport')
      .setLabel("Claim")
      .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
      .setCustomId("contactreport")
      .setLabel("Contact")
      .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
      .setCustomId("takeoverreport")
      .setLabel("❗")
      .setStyle(ButtonStyle.Secondary)
    )

    const modChannel =
      interaction.guild.channels.cache.get("893189759474757693");

    modChannel.send({
      content:
        "<@178689418415177729> <@&893189360105689139> <@&854841000480079882> <@&927318500614225920> **See below complaint:**",
      embeds: [reportEmbed],
      components: [reportButtons]
    });
    interaction.reply({
      content:
        "A report has been sent! We prefer you use other methods, such as opening a ticket or using the Context Menu (right click msg -> Apps -> Report Message), but this will work too! Thanks for helping keep the server tidy.",
      ephemeral: true,
    });
  },
};
