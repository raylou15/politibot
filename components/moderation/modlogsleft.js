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
  ThreadChannel,
  MessageFlags
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");
module.exports = {
  name: "modlogsleft",
  description: "Reminders",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const embed1 = interaction.message.embeds[0];

    const footertext = embed1.footer.text.split(" ");

    const authortext = embed1.author.name.replace(/[()]/g, "").split(" ");
    const lastpart = authortext.length - 1;

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
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("notes")
          .setLabel("Incidents")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("reminders")
          .setLabel("Reminders")
          .setStyle(ButtonStyle.Secondary)
      );
    } else {
      const allbutLast = authortext.slice(0, authortext.length - 1);
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
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("reminders")
          .setLabel("Reminders")
          .setStyle(ButtonStyle.Primary)
      );
    }

    let logDataEmbed = new EmbedBuilder()
      .setAuthor({ name: targetUsername, iconURL: targetAvatar })
      .setColor("White")
      .setTitle("Rule Reminder Log History")
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
      if (logData.length > 10) {
        const lastField = embed1.fields.length - 1;

        const inputString = embed1.fields[lastField].value;
        const match = inputString.match(/Page `(\d+)` \/ `(\d+)`/);

        let pageNumber = 0;
        let totalPages = 0;
        if (match) {
          pageNumber = parseInt(match[1], 10);
          totalPages = parseInt(match[2], 10);
        } else {
          return console.log("Page number not found in the string.");
        }

        if (pageNumber == 1) {
          return interaction.reply({
            content: "Reached first page.",
            flags: [MessageFlags.Ephemeral],
          });
        }

        console.log(pageNumber)

        paginationButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("modlogsleft")
            .setLabel("⬅️ Previous Page")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("modlogsright")
            .setLabel("Next Page ➡️")
            .setStyle(ButtonStyle.Secondary)
        );

        let i = 0;
        let issuerUser;
        logData.forEach((element) => {

          issuerUser = interaction.guild.members.cache.get(element.IssuerID);

          let issuerString;

          if (issuerUser) {
            issuerString = issuerUser.displayName
          } else {
            issuerString = element.IssuerID + " (left server)"
          }

          if ( (i < 10 * (pageNumber - 2)) || (i >= 10 * (pageNumber - 1)) ) {
            if (element.InfractionType === "Rule Reminder") {
              reminders = reminders + 1;
            } else if (element.InfractionType === "Incident") {
              incidents = incidents + 1;
            } else if (element.InfractionType === "Mute") {
              mutes = mutes + 1;
              i = i + 1
            } else if (element.InfractionType === "Warn") {
              warnings = warnings + 1;
              i = i + 1
            } else if (element.InfractionType === "Voice Mute") {
              mutes = mutes + 1;
              i = i + 1
            } else if (element.InfractionType === "Kick") {
              kicks = kicks + 1;
              i = i + 1
            } else if (element.InfractionType === "Ban") {
              bans = bans + 1;
              i = i + 1
            }
          } else {

            if (element.InfractionType == "Rule Reminder" || element.InfractionType == "Incident") {
              if (element.InfractionType == "Rule Reminder") {
                reminders = reminders + 1
              } else if (element.InfractionType == "Incident") {
                incidents = incidents + 1
              }
            } else {

              if (element.InfractionType == "Warn") {
                logDataEmbed.addFields({
                  name: '`' + `⚠️ ${element.InfractionType} issued by ${issuerString}` + '`',
                  value: `${time(element.Date)} \n**Reason:** ${element.Reason} \n**Case ID:** ${element.CaseID} \n━━━━━━━━━━━━━━━`
                })
                warnings = warnings + 1

              } else if (element.InfractionType == "Mute") {
                logDataEmbed.addFields({
                  name: '`' + `🔇 ${element.InfractionType} issued by ${issuerString} for ${element.Duration}` + '`',
                  value: `${time(element.Date)} \n**Reason:** ${element.Reason} \n**Case ID:** ${element.CaseID} \n━━━━━━━━━━━━━━━`
                })
                mutes = mutes + 1

              } else if (element.InfractionType == "Voice Mute") {
                logDataEmbed.addFields({
                  name: '`' + `🔇 ${element.InfractionType} issued by ${issuerString}` + '`',
                  value: `${time(element.Date)} \n**Reason:** ${element.Reason} \n**Case ID:** ${element.CaseID} \n━━━━━━━━━━━━━━━`
                })
                mutes = mutes + 1

              } else if (element.InfractionType == "Kick") {
                logDataEmbed.addFields({
                  name: '`' + `👟 ${element.InfractionType} issued by ${issuerString}` + '`',
                  value: `${time(element.Date)} \n**Reason:** ${element.Reason} \n**Case ID:** ${element.CaseID} \n━━━━━━━━━━━━━━━`
                })
                kicks = kicks + 1

              } else if (element.InfractionType == "Ban") {
                logDataEmbed.addFields({
                  name: '`' + `🚫 ${element.InfractionType} issued by ${issuerString}` + '`',
                  value: `${time(element.Date)} \n**Reason:** ${element.Reason} \n**Case ID:** ${element.CaseID} \n━━━━━━━━━━━━━━━`
                })
                bans = bans + 1

              }

              i = i + 1
            }
          }
        })
      }

      logDataEmbed.addFields({
        name: '📊  User Logs Data:',
        value:
        "- Reminders: `" +
        `${reminders}` +
        "` | Incidents: `" +
        `${incidents}` +
        "` | Warnings: `" +
        `${warnings}` +
        "` | Mutes: `" +
        `${mutes}` +
        "` | Kicks: `" +
        `${kicks}` +
        "` | Bans: `" +
        `${bans}` +
        "`",
      });

    }

    if (paginationButtons) {
      const lastField = embed1.fields.length - 1;

      const inputString = embed1.fields[lastField].value;
      const match = inputString.match(/Page `(\d+)`/);

      let pageNumber = 0;
      if (match) {
        pageNumber = parseInt(match[1], 10);
      } else {
        return console.log("Page number not found in the string.");
      }

      logDataEmbed.addFields({
        name: `Current Page`,
        value:
          "Page `" +
          `${pageNumber -1}` +
          "`" +
          ` / ` +
          "`" +
          `${Math.ceil((warnings + mutes + kicks + bans) / 10)}` +
          "`",
      });
      return interaction.update({
        embeds: [logDataEmbed],
        components: [naviButtons, paginationButtons],
      });
    } else {
      return interaction.update({
        embeds: [logDataEmbed],
        components: [naviButtons],
      });
    }


  },
};
