const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
  ComponentType,
  Embed,
  time,
  MessageFlags
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");
module.exports = {
  name: "notes",
  description: "Notes",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const embed1 = interaction.message.embeds[0];

    const footertext = embed1.footer.text.split(" ");

    const authortext = embed1.author.name.replace(/[()]/g, "").split(" ");
    const lastpart = authortext.length - 1

    const target1 = authortext[lastpart];

    let targetAvatar;
    let targetUsername;
    let naviButtons;
    let logData = [];
    logData = await infractionData.find({ TargetID: target1 });

    const target = interaction.guild.members.cache.get(target1);

    if (target) {
      targetUsername = `${target.displayName} (${target.id})`;
      targetAvatar = target.displayAvatarURL();
      naviButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("moduserinfo")
          .setLabel("User Info")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("moderationlog")
          .setLabel("Moderation")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("notes")
          .setLabel("Incidents")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("reminders")
          .setLabel("Reminders")
          .setStyle(ButtonStyle.Secondary)
      );
    } else {
      const allbutLast = authortext.slice(0, authortext.length - 1)
      targetUsername = `${allbutLast.join(" ")} (${target1})`;
      targetAvatar = embed1.author.iconURL;
      naviButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("moduserinfo")
          .setLabel("User Info")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("moderationlog")
          .setLabel("Moderation")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("notes")
          .setLabel("Incidents")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("reminders")
          .setLabel("Reminders")
          .setStyle(ButtonStyle.Secondary)
      );
    }

    let logDataEmbed = new EmbedBuilder()
      .setAuthor({ name: targetUsername, iconURL: targetAvatar })
      .setColor("White")
      .setTitle("Incident Log History")
      .setFooter({ text: `Requested by ${interaction.member.displayName}` })
      .setTimestamp();

    let warnings = 0;
    let kicks = 0;
    let bans = 0;
    let incidents = 0;
    let mutes = 0;
    let reminders = 0;

    if (!logData) {
      return interaction.reply("There are no logs to show for this user!");
    } else {
      let issuerUser;
      logData.forEach((element) => {
        issuerUser = interaction.guild.members.cache.get(element.IssuerID);
        if (issuerUser) {
          if (element.InfractionType === "Rule Reminder") {
            reminders = reminders + 1
          }
          if (element.InfractionType === "Warn") {
            warnings = warnings + 1
          }
          if (element.InfractionType === "Kick") {
            kicks = kicks + 1
          }
          if (element.InfractionType === "Ban") {
            bans = bans + 1
          }
          if (element.InfractionType === "Mute" || element.InfractionType === "Voice Mute") {
            mutes = mutes + 1
          }
          if (element.InfractionType === "Incident") {
            logDataEmbed.addFields({
              name: '`' + `📋 ${element.InfractionType} issued by ${issuerUser.displayName}` + '`',
              value: `${time(element.Date)}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
            });
            incidents = incidents + 1
          }
        } else {
          if (element.InfractionType === "Rule Reminder") {
            reminders = reminders + 1
          }
          if (element.InfractionType === "Warn") {
            warnings = warnings + 1
          }
          if (element.InfractionType === "Kick") {
            kicks = kicks + 1
          }
          if (element.InfractionType === "Ban") {
            bans = bans + 1
          }
          if (element.InfractionType === "Mute" || element.InfractionType === "Voice Mute") {
            mutes = mutes + 1
          }
          if (element.InfractionType === "Incident") {
            logDataEmbed.addFields({
              name: `🚫 ${element.InfractionType} issued by ${element.IssuerID}`,
              value: `${time(element.Date)}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
            });
            incidents = incidents + 1
          }
        }
      });
    }

    logDataEmbed.addFields({
      name: `📊  User Logs Data:`,
      value: '- Reminders: `' + `${reminders}` + '` | Incidents: `' + `${incidents}` + '` | Warnings: `' + `${warnings}` + '` | Mutes: `' + `${mutes}` + '` | Kicks: `' + `${kicks}` + '` | Bans: `' + `${bans}` + '`'
    });

    interaction.update({ embeds: [logDataEmbed], components: [naviButtons] });
  },
};
