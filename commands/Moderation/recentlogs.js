const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const CaseCountSchema = require("../../schemas/casecount");
const ms = require("ms");
const casecount = require("../../schemas/casecount");

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

    for (let i = countValue - 10; i <= countValue; i++) {
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

    logData.forEach((element) => {
      targetedUser = interaction.guild.members.cache.get(element.TargetID);
      issuerUser = interaction.guild.members.cache.get(element.IssuerID);
      if (!targetedUser) {
        targetUsername = `LEFT SERVER (${element.TargetID})`;
      } else {
        targetUsername = targetedUser.user.tag;
      }
      
      if (element.InfractionType === "Mute") {
        logDataEmbed.addFields({
          name: `${targetUsername} | ${element.InfractionType} issued by ${issuerUser.user.tag} for ${element.Duration}`,
          value: `${element.Date}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
        });
      } else {
        logDataEmbed.addFields({
          name: `${targetUsername} | ${element.InfractionType} issued by ${issuerUser.user.tag}`,
          value: `${element.Date}\n**Reason:** ${element.Reason}\n**Case ID:** ${element.CaseID}\n━━━━━━━━━━━━━━━`,
        });
      }
    });
    await interaction.reply({ embeds: [logDataEmbed] });
  },
};
