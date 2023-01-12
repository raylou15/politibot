const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  AutoModerationRuleKeywordPresetType,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("case")
    .setDescription("Case Handling")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View a logged case")
        .addNumberOption((options) =>
          options
            .setName("id")
            .setDescription("Input the Case ID")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a logged case")
        .addNumberOption((options) =>
          options
            .setName("id")
            .setDescription("Input the Case ID")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("edit")
        .setDescription("Edit a logged case")
        .addNumberOption((options) =>
          options
            .setName("id")
            .setDescription("Input the Case ID")
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("reason")
            .setDescription("Input the new reason for the Case")
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === "view") {
      const targetedCaseID = interaction.options.getNumber("id");

      let logData = await infractionData.findOne({ CaseID: targetedCaseID });

      if (!logData) {
        interaction.reply(
          "This is not a valid Case ID! The case may never have existed or has been deleted."
        );
      } else {
        if (interaction.guild.members.cache.get(logData.TargetID)) {
          console.log("User is still in server!");
          targetUser = interaction.guild.members.cache.get(logData.TargetID);
          targetUserTag = targetUser.user.tag;
          targetUserAvatar = targetUser.user.displayAvatarURL();
        } else {
          console.log("User is no longer in server...");
          targetUser = "USER LEFT SERVER";
          targetUserTag = " "
          targetUserAvatar = client.user.displayAvatarURL()
        }
        if (interaction.guild.members.cache.get(logData.IssuerID)) {
          console.log("User is still in server!");
          issuerUser = interaction.guild.members.cache.get(logData.IssuerID);
          issuerUserTag = issuerUser.user.tag
        } else {
          console.log("User is no longer in server...");
          issuerUser = "USER LEFT SERVER";
          issuerUserTag = " "
        }
        let typeInfo;
        if (logData.InfractionType === "Mute") {
          typeInfo = `**Member muted for ${logData.Duration}:**\n🔇 ${await targetUser} (${logData.TargetID})`;
        } else if (logData.InfractionType === "Incident") {
          typeInfo = `**Incident issued against member:**\n🚫 ${targetUser} (${logData.TargetID})`;
        } else if (logData.InfractionType === "Warn") {
          typeInfo = `**Member issued warning:**\n⚠️ ${targetUser} (${logData.TargetID})`;
        } else if (logData.InfractionType === "Kick") {
          typeInfo = `**Member kicked:**\n🥾 ${targetUser} (${logData.TargetID})`;
        } else if (logData.InfractionType === "Ban") {
          typeInfo = `**Member banned:**\n🔨 (${logData.TargetID})`;
        } else if (logData.InfractionType === "Voice Mute") {
          typeInfo = `**Member voice muted:**\n🔇 ${await targetUser} (${logData.TargetID})`;
        } else {
          typeInfo = "ERROR";
        }

        const logEmbed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${targetUserTag}`,
            iconURL: `${targetUserAvatar}`,
          })
          .setDescription(typeInfo)
          .addFields(
            { name: "**Reason:**", value: logData.Reason },
            { name: "**Case ID:**", value: logData.CaseID.toString() }
          )
          .setFooter({
            text:
              "Action Issued: " + logData.Date + ` by ${issuerUserTag}`,
            iconURL: client.user.avatarURL(),
          });

        interaction.reply({ embeds: [logEmbed] });
      }

      console.log();
    } else if (interaction.options.getSubcommand() === "delete") {

      const caseID = interaction.options.getNumber("id");

      let logData = await infractionData.findOne({ CaseID: caseID });

      if (!logData) return interaction.reply("This Case ID doesn't exist. Check your ID again.")

      await infractionData.findOneAndUpdate(
        { CaseID: caseID }, 
        { $set: {Reason: `CASE DELETED BY ${interaction.user.tag}`, TargetID: "0"} }
      ).then(interaction.reply(`Case ID ${caseID} deleted!`))

    } else if (interaction.options.getSubcommand() === "edit") {
      const newReason = interaction.options.getString("reason");
      const caseID = interaction.options.getNumber("id");

      let logData = await infractionData.findOne({ CaseID: caseID });

      if (!logData) {
        return interaction.reply("This Case ID doesn't exist. Check your ID again.");
      }

      await infractionData.findOneAndUpdate(
        { CaseID: caseID },
        { $set: { Reason: newReason } }
      );

      const targetUser = await interaction.guild.members.fetch(
        `${logData.TargetID}`
      );
      const issuerUser = await interaction.guild.members.fetch(
        `${logData.IssuerID}`
      );
      let typeInfo;
      if (logData.InfractionType === "Mute") {
        typeInfo = `**Member muted for ${logData.Duration}:**\n🔇 ${targetUser} (${logData.TargetID})`;
      } else if (logData.InfractionType === "Incident") {
        typeInfo = `**Incident issued against member:**\n🚫 ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (logData.InfractionType === "Warn") {
        typeInfo = `**Member issued warning:**\n⚠️ ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (logData.InfractionType === "Kick") {
        typeInfo = `**Member kicked:**\n🥾 ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (logData.InfractionType === "Ban") {
        typeInfo = `**Member banned:**\n🔨 (${logData.TargetID})`;
      } else if (logData.InfractionType === "Voice Mute") {
        typeInfo = `**Member voice muted:**\n🔇 ${await targetUser} (${logData.TargetID})`;
      } else {
        typeInfo = "ERROR";
      }

      const editEmbed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: `${targetUser.user.tag}`,
          iconURL: `${targetUser.user.avatarURL()}`,
        })
        .setDescription(typeInfo)
        .addFields(
          { name: "**Reason:**", value: newReason },
          { name: "**Case ID:**", value: logData.CaseID.toString() }
        )
        .setFooter({
          text: "Action Issued: " + logData.Date + ` by ${issuerUser.user.tag}`,
          iconURL: client.user.avatarURL(),
        });

      interaction.reply({ content: "Case Updated:", embeds: [editEmbed] });
    }
  },
};
