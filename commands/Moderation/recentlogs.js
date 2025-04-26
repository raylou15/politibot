const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  time,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const CaseCountSchema = require("../../schemas/casecount");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recentlogs")
    .setDescription("View the past 10 logs.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const currentCount = await CaseCountSchema.find({
      _id: "637acf789ff4d033474c8454",
    });
    const countValue = currentCount[0].CaseCount;

    let logData = [];

    for (let i = countValue - 9; i <= countValue; i++) {
      logData.push(await infractionData.findOne({ CaseID: i }));
    }

    let logDataEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Moderation Log History (Last 10)")
      .setTimestamp();

    let targetUsername;
    let issuerUser;
    let targetedUser;

    await interaction.guild.members.fetch();

    let warnings = 0;
    let kicks = 0;
    let bans = 0;
    let incidents = 0;
    let mutes = 0;

    let violators = [];

    logData.forEach((element) => {
      targetedUser = interaction.guild.members.cache.get(element.TargetID);
      issuerUser = interaction.guild.members.cache.get(element.IssuerID);
      violators.push(element.TargetID)
      if (!targetedUser) {
        targetUsername = `LEFT SERVER (${element.TargetID})`;
      } else {
        targetUsername = targetedUser.user.username;
      }
      if (issuerUser) {
        if (element.InfractionType === "Mute" || element.InfractionType === "Voice Mute") {
          logDataEmbed.addFields({
            name: `${targetUsername} | 🔇 ${element.InfractionType} issued by ${issuerUser.user.username} for ${element.Duration}`,
            value: `${time(element.Date, 'F')}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
          });
        } else {
          logDataEmbed.addFields({
            name: `${targetUsername} | ⚠️ ${element.InfractionType} issued by ${issuerUser.user.username}`,
            value: `${time(element.Date, 'F')}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
          });
        }
      } else {
        if (element.InfractionType === "Mute" || element.InfractionType === "Voice Mute") {
          logDataEmbed.addFields({
            name: `${targetUsername} | 🔇 ${element.InfractionType} issued by ${element.IssuerID} (left server) for ${element.Duration}`,
            value: `${time(element.Date, 'F')}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
          });
        } else {
          logDataEmbed.addFields({
            name: `${targetUsername} | ⚠️ ${element.InfractionType} issued by ${element.IssuerID} (left server)`,
            value: `${time(element.Date, 'F')}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
          });
        }
      }

      if (element.InfractionType === "Warn") {
        warnings = warnings + 1
      } else if (element.InfractionType === "Kick") {
        kicks = kicks + 1
      } else if (element.InfractionType === "Ban") {
        bans = bans + 1
      } else if (element.InfractionType === "Incident") {
        incidents = incidents + 1
      } else if (element.InfractionType === "Mute" || element.InfractionType === "Voice Mute") {
        mutes = mutes + 1
      }

    });

    function findRepeatedStrings(arr) {
      const repeatedStrings = {};
      
      for (let i = 0; i < arr.length; i++) {
        const currentString = arr[i];
        
        if (repeatedStrings[currentString]) {
          repeatedStrings[currentString]++;
        } else {
          repeatedStrings[currentString] = 1;
        }
      }
      
      const result = [];
      
      for (const string in repeatedStrings) {
        if (repeatedStrings[string] >= 2) {
          if (interaction.guild.members.cache.get(string)) {
            result.push(interaction.guild.members.cache.get(string).displayName + ` (${string})`)
          } else {
            result.push(`Left Server (${string})`)
          }
        }
      }
      
      return result;
    }

    const commonviolators = findRepeatedStrings(violators)

    if (commonviolators.length === 0) {
      commonviolators.push("N/A")
    }

    logDataEmbed.addFields({
      name: `📊  Last 10 Logs Data:`,
      value: '- Incidents: `' + `${incidents}` + '` | Warnings: `' + `${warnings}` + '` | Mutes: `' + `${mutes}` + '` | Kicks: `' + `${kicks}` + '` | Bans: `' + `${bans}` + '`' +
      '\n- Common Violators: `' + `${commonviolators.join(", ")}` + '`'
    })
    await interaction.reply({ embeds: [logDataEmbed] });
  },
};
