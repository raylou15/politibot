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
  MessageFlags,
  time
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Moderation Logs")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  /**
   *
   * @param {ContextMenuCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const target = interaction.targetMember

    let targetAvatar;
    let targetUsername;
    let naviButtons;
    let logData = [];
    logData = await infractionData.find({ TargetID: target.id });

    if (target) {
      targetUsername = `${target.displayName} (${target.id})`;
      targetAvatar = target.displayAvatarURL();
      if (interaction.guild.members.cache.get(target.id)) {
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
        naviButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("moduserinfo")
            .setLabel("User Info")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
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
      }
    } else {
      targetUsername = `USER LEFT SERVER ${target.id}`;
      targetAvatar =
        "https://cdn.pixabay.com/photo/2013/07/12/13/50/prohibited-147408__340.png";
      if (interaction.guild.members.cache.get(target.id)) {
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
        naviButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("moduserinfo")
            .setLabel("User Info")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
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
      }
    }

    let logDataEmbed = new EmbedBuilder()
      .setAuthor({ name: targetUsername, iconURL: targetAvatar })
      .setColor("White")
      .setTitle("Moderation Log History")
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
      console.log(logData.length)
      if (logData.length > 10) {

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

          if ( i >= 10 ) {
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

      logDataEmbed.addFields({
        name: `📊  User Logs Data:`,
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

      if (paginationButtons) {
        logDataEmbed.addFields({
          name: `Current Page`,
          value:
            "Page `1`" +
            ` / ` +
            "`" +
            `${Math.ceil((warnings + mutes + kicks + bans) / 10)}` +
            "`",
        });
        return interaction.reply({
          embeds: [logDataEmbed],
          components: [naviButtons, paginationButtons],
          flags: [MessageFlags.Ephemeral]
        });
      } else {
        return interaction.reply({
          embeds: [logDataEmbed],
          components: [naviButtons],
          flags: [MessageFlags.Ephemeral]
        });
      }
    }


  },
};
