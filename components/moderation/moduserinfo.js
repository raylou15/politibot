const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  SelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
  ComponentType,
  Embed,
  DataResolver,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const verificationData = require("../../schemas/verificationdata");

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const rulestestSheetID = `1Fw7MxjEaZ-u-YfBmK7mI_ld3rjfDqNrznEJKoE9QuPo`;
const sheetsCreds = require("../../sheetscreds.json");

const ms = require("ms");
module.exports = {
  name: "moduserinfo",
  description: "moduserinfo",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const embed1 = interaction.message.embeds[0];

    const footertext = embed1.footer.text.split(" ");

    const authortext = embed1.author.name.replace(/[()]/g, "").split(" ");

    // console.log(authortext)

    const lastNumber = authortext.length - 1

    const target1 = authortext[lastNumber];

    let targetAvatar;
    let targetUsername;
    let targetMember;
    let targetUser;
    let logData = [];
    let ageData = [];
    let rulestestInfo = [];
    logData = await infractionData.find({ TargetID: target1 });
    ageData = await verificationData.find({ UserID: target1 });

    const warnCount = logData.reduce((accumulator, obj) => {
      if (obj.InfractionType === "Warn") {
        return accumulator + 1
      } else {
        return accumulator
      }
    }, 0);
    const muteCount = logData.reduce((accumulator, obj) => {
      if (obj.InfractionType === "Mute" || obj.InfractionType === "Voice Mute") {
        return accumulator + 1
      } else {
        return accumulator
      }
    }, 0);
    const kickbanCount = logData.reduce((accumulator, obj) => {
      if (obj.InfractionType === "Kick" || obj.InfractionType === "Ban") {
        return accumulator + 1
      } else {
        return accumulator
      }
    }, 0);
    const reminderCount = logData.reduce((accumulator, obj) => {
      if (obj.InfractionType === "Rule Reminder") {
        return accumulator + 1
      } else {
        return accumulator
      }
    }, 0);
    const incidentCount = logData.reduce((accumulator, obj) => {
      if (obj.InfractionType === "Incident") {
        return accumulator + 1
      } else {
        return accumulator
      }
    }, 0);

    const target = interaction.guild.members.cache.get(target1);

    if (target) {
      const allbutLast = authortext.slice(0, authortext.length - 1)
      targetUsername = `${allbutLast.join(" ")} (${target1})`;
      targetAvatar = target.displayAvatarURL();
      targetMember = interaction.guild.members.cache.get(target.id);
      if (targetMember === undefined) {
        return interaction.reply({ ephemeral: true, content: "This user is likely no longer part of the server." })
      }
      targetUser = await targetMember.user;
    } else {
      targetUsername = `${authortext[0]} (${target1})`;
      targetAvatar = embed1.author.iconURL;
      targetMember = interaction.guild.members.cache.get(target1);
      if (targetMember === undefined) {
        return interaction.reply({ ephemeral: true, content: "This user is likely no longer part of the server." })
      }
      targetUser = await targetMember.user;
    }

    const naviButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("moduserinfo")
        .setLabel("User Info")
        .setStyle(ButtonStyle.Primary),
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
        .setStyle(ButtonStyle.Secondary)
    );

    let infoEmbed = new EmbedBuilder()
      .setColor("White")

    const accountCreated = parseInt(targetMember.user.createdTimestamp / 1000);
    const joinTime = parseInt(targetMember.joinedAt / 1000);

    let flags = [];

    if (Date.now() - targetMember.user.createdAt < 1000 * 60 * 60 * 24 * 14) {
      flags.push("`🚩 New Account`")
      infoEmbed.setColor("Yellow")
    }
    if (Date.now() - targetMember.joinedAt < 1000 * 60 * 60 * 24 * 14) {
      flags.push("`🚩 Joined Recently`")
      infoEmbed.setColor("Yellow")
    }
    if (logData.length > 10) {
      flags.push("`🧨 Rule Violator`")
      infoEmbed.setColor("Red")
    }
    if (kickbanCount > 0) {
      flags.push("`👢 Previously Kicked/Banned`")
      infoEmbed.setColor("Red")
    }
    let R7count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R7")) {
        R7count = R7count + 1
      }
    })
    let R1count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R1")) {
        R1count = R1count + 1
      }
    })
    let R4count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R4")) {
        R4count = R4count + 1
      }
    })
    let R13count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R13")) {
        R13count = R13count + 1
      }
    })
    let R11count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R11")) {
        R11count = R11count + 1
      }
    })
    let R12count = 0;
    logData.forEach(log => {
      if (log.Reason.includes("R12")) {
        R12count = R12count + 1
      }
    })

    if (R1count > 4) {
      flags.push("`🚩 Disrespectful`")
    }
    if (R4count > 4) {
      flags.push("`🚩 Extremist`")
    }
    if (R7count > 4) {
      flags.push("`🚩 Rule 7 Violator`")
    }
    if (R11count > 4) {
      flags.push("`🚩 Misinformational`")
    }
    if (R12count > 4) {
      flags.push("`🚩 Malicious Behavior`")
    }
    if (R13count > 4) {
      flags.push("`🚩 Bad Faith Behavior`")
    }




    if (targetMember.roles.cache.some(role => ["Management", "Senior Moderator", "Moderator", "Trial Moderator"].includes(role.name))) {
      flags = ["`🛡️ Moderator`"]
      infoEmbed.setColor("Blue")
    }

    if (flags.length === 0) {
      flags.push("`No Flags`")
    }






    const auth = new JWT({
      email: sheetsCreds.client_email,
      key: sheetsCreds.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(rulestestSheetID, auth);
    await doc.loadInfo();
    // const sheet = doc.sheetsByIndex[0];
    // const rows = await sheet.getRows();

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 4) Fetch *all* rows (this also loads the header row internally)
    const rows = await sheet.getRows();

    // 5) Now headerValues is populated—normalize and locate your “Username” column
    const headers = sheet.headerValues.map(h => h.replace(/^\uFEFF/, '').trim());
    const usernameColIndex = headers.findIndex(
      h => h.toLowerCase() === 'username'
    );
    if (usernameColIndex < 0) {
      throw new Error(
        `Couldn’t find a 'Username' column. Found: ${headers.join(', ')}`
      );
    }

    // 6) Count how many rows match your target
    const target2 = targetUser.username.trim().toLowerCase();
    const matchCount = rows.reduce((sum, row) => {
      const cell = String(row._rawData[usernameColIndex] || '')
        .trim()
        .toLowerCase();
      return sum + (cell === target2 ? 1 : 0);
    }, 0);

    console.log(`Found ${matchCount} submission(s) by ${targetUser.username}`);





    infoEmbed
      .setAuthor({ name: targetUsername, iconURL: targetAvatar })
      .setDescription(`${targetUser}`)
      .addFields(
        {
          name: `📋  Basic Information`,
          value: '‣ Username: ' + '`' + `${targetUser.username}` + '`' + '\n' + '‣ Display Name: ' + '`' + `${targetMember.displayName}` + '`' + '\n' + '‣ User ID: ' + '`' + `${targetUser.id}` + '`' + `\n` + `‣ Indicated Age Group: ` + '`' + `${ageData?.[0]?.Age ?? "No Record"}` + '`' + '\nㅤ'
        },
        {
          name: `📅  Join Dates`,
          value: `‣ Account Created: <t:${accountCreated}:D> | <t:${accountCreated}:R> \n‣ Account Joined: <t:${joinTime}:D> | <t:${joinTime}:R>` + '\nㅤ'
        },
        {
          name: `⚠️  Moderation Data`,
          value: `‣ Total Infractions: ` + '`' + `${logData.length}` + '`' + `\n‣ Reminders: ` + '`' + `${reminderCount}` + '`' + `\n‣ Incidents: ` + '`' + `${incidentCount}` + '`' + `\n‣ Warnings: ` + '`' + `${warnCount}` + '`' + `\n‣ Mutes: ` + '`' + `${muteCount}` + '`' + `\n‣ Kicks/Bans: ` + '`' + `${kickbanCount}` + '`' + `\n‣ **Taken Rules Test:** ` + '`' + `${matchCount > 0}` + '`',
          inline: true
        },
        {
          name: `🚩  Moderator Flags`,
          value: `${flags.join('\n')}`,
          inline: true
        }
      )
      .setThumbnail(targetMember.displayAvatarURL())
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    interaction.update({ embeds: [infoEmbed], components: [naviButtons] });
  },
};
