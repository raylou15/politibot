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
  ButtonStyle,
  ActionRowBuilder,
  time
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");
const date = new Date();

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Report Message")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  /**
   *
   * @param {ContextMenuCommandInteraction} interaction
   */
    async execute(interaction, client) {
      const targetMsg = await interaction.channel.messages.fetch(
        interaction.targetId
      );
      const targetUser = targetMsg.author;
      const modChannel =
        interaction.guild.channels.cache.get("893189759474757693");

      const reportModal = new ModalBuilder()
        .setCustomId("reportModal")
        .setTitle("Report a Message");

      const reportInputField = new TextInputBuilder()
        .setCustomId("reportinput")
        .setLabel("Provide us some details")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(10)
        .setMaxLength(512)
        .setRequired(true)
        .setPlaceholder("Input your reason here");

      const reportActionRow = new ActionRowBuilder().addComponents(
        reportInputField
      );
      reportModal.addComponents(reportActionRow);

      //Custom filter to prevent duplicate modals!
      const filter = (i) => {
        i.deferUpdate();
        return i.customId === interaction.id;
      };

      await interaction.showModal(reportModal);

      const modalSubmission = await interaction.awaitModalSubmit({
        filter: (i) => {
          i.deferUpdate();
          console.log("Await Modal Submit")
          return true;
        },
        time: 10000,
      });

      console.log(`User ${interaction.user.tag} has submitted a report.`)

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
          value: modalSubmission.fields.getTextInputValue('reportinput'),
          inline: true
        },
        {
          name: "Claimed by:",
          value: "N/A",
          inline: true
        },
        {
          name: "Information",
          value: `Reported in ${interaction.channel.toString()} ${time(date, 'R')} \nReported Message: ${targetMsg.url}`
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

      modChannel.send({
        content:
          "<@178689418415177729> <@&893189360105689139> <@&854841000480079882> <@&927318500614225920> **See below complaint:**",
        embeds: [reportEmbed],
        components: [reportButtons]
      });

      modalSubmission.reply({
        content:
          "Thanks for reporting this and helping keep the server clean! If you'd like to know more information about our decision-making process, you're encourage to open a ticket in the future.",
        ephemeral: true,
      }).catch(async (err) => {
      console.log("Report Menu timed out / Other Error");
    });
  },
};
