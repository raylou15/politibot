const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  AutoModerationRuleKeywordPresetType,
  time,
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
    .addSubcommandGroup(group => group
      .setName("edit")
      .setDescription("Edit a logged case")
      .addSubcommand(subcommand => subcommand
        .setName("reason")
        .setDescription("Edit a logged reason")
        .addNumberOption(options => options
          .setName("id")
          .setDescription("Input the Case ID")
          .setRequired(true)  
        )
        .addStringOption(options => options
          .setName("reason")
          .setDescription("Input the new reason to be attached to the case")
          .setRequired(true)  
        )
      )
      .addSubcommand(group => group
        .setName("type")
        .setDescription("Edit the type of infraction")
        .addNumberOption(options => options
          .setName("id")
          .setDescription("Input the Case ID")
          .setRequired(true)  
        )  
        .addStringOption(options => options
          .setName("type")
          .setDescription("The new infraction type to issue")
          .setAutocomplete(true)
          .setRequired(true)  
        )
      )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true)
    let choices;
    if (focusedOption.name === 'type') {
        choices = ['Incident', 'Warn', 'Mute', 'Kick', 'Ban']
    }

    const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })),
    );
    return;
  },
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
          targetUserTag = targetUser.displayName;
          targetUserAvatar = targetUser.user.displayAvatarURL({dynamic: true});
        } else {
          console.log("User is no longer in server...");
          targetUser = "USER LEFT SERVER";
          targetUserTag = " "
          targetUserAvatar = client.user.displayAvatarURL({dynamic: true})
        }
        if (interaction.guild.members.cache.get(logData.IssuerID)) {
          console.log("User is still in server!");
          issuerUser = interaction.guild.members.cache.get(logData.IssuerID);
          issuerUserTag = issuerUser.displayName
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
            iconURL: client.user.displayAvatarURL({dynamic: true}),
          });

        interaction.reply({ embeds: [logEmbed] });
      }

      console.log();
    } else if (interaction.options.getSubcommand() === "delete") {

      const caseID = interaction.options.getNumber("id");

      let logData = await infractionData.findOne({ CaseID: caseID });

      if (!logData) return interaction.reply("This Case ID doesn't exist. Check your ID again.")

      const targetUser = await interaction.guild.members.fetch(
        `${logData.TargetID}`
      );
      if (targetUser === undefined) {
        return interaction.reply({ ephemeral: true, content: "This user has left the server."})
      }
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
        name: `${targetUser.displayName}`,
        iconURL: `${targetUser.user.displayAvatarURL({dynamic: true})}`,
      })
      .setDescription(typeInfo)
      .addFields(
        { name: "**Reason:**", value: logData.Reason },
        { name: "**Case ID:**", value: logData.CaseID.toString() }
      )
      .setFooter({
        text: "Action Issued: " + logData.Date + ` by ${issuerUser.displayName}`,
        iconURL: client.user.displayAvatarURL({dynamic: true}),
      });

      await infractionData.findOneAndUpdate(
        { CaseID: caseID }, 
        { $set: {Reason: `CASE DELETED BY ${interaction.user.username}`, TargetID: "0"} }
      ).then(interaction.reply(`Case ID ${caseID} deleted!`))

      targetUser.send({ content: "A previous case has been deleted:", embeds: [editEmbed]});
      const logChannel = interaction.guild.channels.cache.get("1052421373353525351");
      logChannel.send({ content: "A previous case has been deleted:", embeds: [editEmbed] });
      const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");
      pubLogChannel.send({ content: "A previous case has been deleted:", embeds: [editEmbed] });

    } else if (interaction.options.getSubcommand() === "reason") {
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
      if (targetUser === undefined) {
        return interaction.reply({ ephemeral: true, content: "This user has left the server."})
      }
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
          name: `${targetUser.displayName}`,
          iconURL: `${targetUser.user.displayAvatarURL({dynamic: true})}`,
        })
        .setDescription(typeInfo)
        .addFields(
          { name: "**Reason:**", value: newReason },
          { name: "**Case ID:**", value: logData.CaseID.toString() }
        )
        .setFooter({
          text: "Action Issued: " + logData.Date + ` by ${issuerUser.displayName}`,
          iconURL: client.user.displayAvatarURL({dynamic: true}),
        });

      interaction.reply({ content: "Case Updated:", embeds: [editEmbed] });
      targetUser.send({ content: "A previous case has been updated with a new Reason:", embeds: [editEmbed] }).catch(async (err) => {
        console.log(err);
        interaction.channel.send({
          content:
            "I couldn't DM this user since they do not accept DMs from server bots/members.",
        });
      });

      const logChannel = interaction.guild.channels.cache.get("1052421373353525351");
      logChannel.send({ content: "A previous case has been updated with a new Reason:", embeds: [editEmbed] });
      const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");
      pubLogChannel.send({ content: "A previous case has been updated with a new Reason:", embeds: [editEmbed] });



    } else if (interaction.options.getSubcommand() === "type") {
      const newType = interaction.options.getString("type");
      const caseID = interaction.options.getNumber("id");

      let logData = await infractionData.findOne({ CaseID: caseID });
      if (!logData) {
        return interaction.reply("This Case ID doesn't exist. Check your ID again.");
      }

      console.log(logData.InfractionType)
      const oldType = logData.InfractionType

      // Handle some preliminary errors.
      if (oldType === "Ban" || oldType === "Kick") {
        return await interaction.reply({ephemeral: true, content: "Currently, you cannot downgrade a ban or a kick to a lower punishment. You will need to issue a new log, for now."})
      }
      if (newType === "Kick" || newType === "Ban" || newType === "Mute") {
        return await interaction.reply({ ephemeral: true, content: "This command currently does not support changing logs to mutes, kicks, or bans."})
      }
      
      if (oldType === newType) {
        return await interaction.reply({ ephemeral: true, content: `You're trying to change a ${oldType} into a ${newType}... that's pointless!`})
      }

      console.log(oldType)
      console.log(newType)


      // Handle the new case.
      const targetUser = await interaction.guild.members.fetch(
        `${logData.TargetID}`
      );
      const issuerUser = await interaction.guild.members.fetch(
        `${logData.IssuerID}`
      );

      if (oldType === "Mute") {
        targetUser.timeout(null)  
      }

      await infractionData.findOneAndUpdate(
        { CaseID: caseID },
        { $set: { InfractionType: newType } }
      );

      let typeInfo;
      if (newType === "Mute") {
        typeInfo = `**Member muted for ${logData.Duration}:**\n🔇 ${targetUser} (${logData.TargetID})`;
      } else if (newType === "Incident") {
        typeInfo = `**Incident issued against member:**\n🚫 ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (newType === "Warn") {
        typeInfo = `**Member issued warning:**\n⚠️ ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (newType === "Kick") {
        typeInfo = `**Member kicked:**\n🥾 ${await targetUser} (${
          logData.TargetID
        })`;
      } else if (newType === "Ban") {
        typeInfo = `**Member banned:**\n🔨 (${logData.TargetID})`;
      } else if (newType === "Voice Mute") {
        typeInfo = `**Member voice muted:**\n🔇 ${await targetUser} (${logData.TargetID})`;
      } else {
        typeInfo = "ERROR";
      }

      const editEmbed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: `${targetUser.displayName}`,
          iconURL: `${targetUser.user.displayAvatarURL({dynamic: true})}`,
        })
        .setDescription(typeInfo)
        .addFields(
          { name: "**Reason:**", value: logData.Reason },
          { name: "**Case ID:**", value: logData.CaseID.toString() }
        )
        .setFooter({
          text: "Action Issued: " + logData.Date + ` by ${issuerUser.displayName}`,
          iconURL: client.user.displayAvatarURL({dynamic: true}),
        });

      await interaction.reply({ content: "Case Updated:", embeds: [editEmbed] });
      targetUser.send({ content: "A previous case has been updated with a new infraction type:", embeds: [editEmbed] }).catch(async (err) => {
        console.log(err);
        interaction.channel.send({
          content:
            "I couldn't DM this user since they do not accept DMs from server bots/members.",
        });
      });

      const logChannel = interaction.guild.channels.cache.get("1052421373353525351");
      logChannel.send({ content: "A previous case has been updated with a new infraction type:", embeds: [editEmbed] });
      const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");
      pubLogChannel.send({ content: "A previous case has been updated with a new infraction type:", embeds: [editEmbed] });

    }
  },
};
