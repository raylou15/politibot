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
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Rules Reminder")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  /**
   *
   * @param {ContextMenuCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const targetMsg = await interaction.channel.messages.fetch(
      interaction.targetId
    );
    const targetUser = await targetMsg.author;

    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    const infoRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("rulesreminderinfo")
        .setLabel("Get More Info")
        .setStyle(ButtonStyle.Secondary)
    )

    const pickaRule = new EmbedBuilder()
      .setColor("White")
      .setTitle("📕  Rules Reminder")
      .setDescription(
        `Do you think someone is violating a rule? You can give them a gentle reminder in a good faith way by sending them a message reminder through this prompt. While rules and their enforcement is ultimately at the determination of staff, you can try to give someone a nudge in the right direction.\n\n❕ Be sure to double check <#775838975755681842>, or your respective channel's rules, and make sure you are citing the right rule/ruleset ❕`
      )
      .addFields({
        name: "Targeted User / Message:",
        value: `${targetUser.toString()} \n[Click to jump to message](${targetMsg.url
          })`,
      })
      .setFooter({
        text: `If you clicked this by mistake, or chose the wrong message, click "Dismiss Message" below, or "Cancel". This prompt times out in 2 minutes.\n━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━`,
      });

    const cancelButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cancelrulesreminder")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    const rulesList1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("r1")
        .setLabel("Rule 1")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r2")
        .setLabel("Rule 2")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r3")
        .setLabel("Rule 3")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r4")
        .setLabel("Rule 4")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r5")
        .setLabel("Rule 5")
        .setStyle(ButtonStyle.Secondary)
    );

    const rulesList2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("r6")
        .setLabel("Rule 6")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r7")
        .setLabel("Rule 7")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r8")
        .setLabel("Rule 8")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r9")
        .setLabel("Rule 9")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r10")
        .setLabel("Rule 10")
        .setStyle(ButtonStyle.Secondary)
    );

    const rulesList3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("r11")
        .setLabel("Rule 11")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r12")
        .setLabel("Rule 12")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("r13")
        .setLabel("Rule 13")
        .setStyle(ButtonStyle.Secondary)
    );

    const rulesList4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("generalreminder")
        .setLabel("General Reminder")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("channelrules")
        .setLabel("Channel Rules")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("englishonly")
        .setLabel("English Only")
        .setStyle(ButtonStyle.Primary)
    );

    const sentMsg = await interaction.reply({
      embeds: [pickaRule],
      components: [
        cancelButton,
        rulesList4,
        rulesList1,
        rulesList2,
        rulesList3,
      ],
      ephemeral: true,
      fetchReply: true,
    });

    sentMsg
      .awaitMessageComponent({
        filter,
        componentType: ComponentType.Button,
        time: 1200000,
      })
      .then(async (interaction) => {
        if (interaction.customId === "cancelrulesreminder") {
          interaction.update({
            content: "Rules Reminder Prompt Cancelled.",
            ephemeral: true,
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "generalreminder") {
          const generalRules = new EmbedBuilder()
            .setColor("White")
            .setTitle("📕  General Rules Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOperation Politics strives on civil discourse and principles of mutual respect and a shared desire to promote healthy debate. In order for this to happen, it's integral that all users try and follow **all server rules**, because there cannot be productive dialogue if not everyone participates in good faith. You can check and read our rules in <#775838975755681842>, or check the specific Channel Guidelines or Channel Description for whichever channel you may be in.\n\nIf you have any questions about the rules, don't ask them here... open a Moderation Inquiry in <#999439440273473657> to talk with Moderators directly!)`
            )
            .setFooter({
              text: `Moderators have the final say-so on what is or is not a rule violation. This is not a warning, this is just a reminder.`,
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `General Rules Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          sentMsg.channel.send({
            content: `${targetUser.toString()}`,
            embeds: [generalRules],
          });
          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
            ephemeral: true,
          });
        } else if (interaction.customId === "channelrules") {
          const updatedEmbed = new EmbedBuilder()
            .setColor("White")
            .setDescription(
              "Which channel are you trying to remind people the rules for?"
            );

          const pickaChannel = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("seriousdiscussion")
              .setLabel("👤︱serious-discussion")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("hottakes")
              .setLabel("🔥︱hot-takes")
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId("otherchannelpicked")
              .setLabel("Other Channel")
              .setStyle(ButtonStyle.Secondary)
          );

          interaction.update({
            embeds: [updatedEmbed],
            components: [pickaChannel],
          });

          sentMsg
            .awaitMessageComponent({
              filter,
              componentType: ComponentType.Button,
              time: 1200000,
            })
            .then(async (interaction) => {
              if (interaction.customId === "seriousdiscussion") {
                const seriousEmbed = new EmbedBuilder()
                  .setColor("White")
                  .setTitle("📕  Serious Discussion Rules Reminder")
                  .setDescription(
                    `Hey there, ${targetUser.toString()}!\n\n<#1006354250017808424> is generally for more serious, structured, and formal debates. While it's not expected that *every* topic at *all* times will adhere to this standard, we expect you to try to do your best to contribute to these discussions in the most meaningful, productive, and good faith way. If you're looking for more informal debate or discussion, try <#964239900620759070>!\n\n[This message](${targetMsg.url
                    }) was potentially in disregard of the channel's rules, or the thread's designated subject. You can check out some common mistakes and important resources below to help you participate in this server better.`
                  )
                  .setFooter({
                    text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
                  });

                let profileData = new infractionData({
                  CaseID: 99999,
                  TargetID: targetMsg.author.id,
                  IssuerID: interaction.user.id,
                  InfractionType: "Rule Reminder",
                  Date: Date.now(),
                  Reason: `Serious Discussion Rules Reminder: ${targetMsg.url}`,
                });
                await profileData.save().catch(console.error);
                console.log("New log created and saved!");

                targetMsg.reply({
                  embeds: [seriousEmbed],
                  components: [infoRow]
                });
              } else if (interaction.customId === "hottakes") {
                const hottakesEmbed = new EmbedBuilder()
                  .setColor("White")
                  .setTitle("📕  Hot Takes Rules Reminder")
                  .setDescription(
                    `Hey there, ${targetUser.toString()}!\n\n<#1007831196874575902> is a channel for making unpopular (but not rule-violating) opinions and debating with folks about it. These posts can be related to politics, food, games, or generally anything. However, shitposting and derailing conversations isn't allowed. Also, do your best to be respectful, no matter how down and dirty you think someone's takes are.\n\nEverything posted in this channel is all in good faith and good fun, keep it that way!\n\n[This message](${targetMsg.url
                    }) was potentially in violation of the server rules, channel rules, or thread topic. Be careful!`
                  )
                  .setFooter({
                    text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
                  });

                let profileData = new infractionData({
                  CaseID: 99999,
                  TargetID: targetMsg.author.id,
                  IssuerID: interaction.user.id,
                  InfractionType: "Rule Reminder",
                  Date: Date.now(),
                  Reason: `Hot Takes Rules Reminder: ${targetMsg.url}`,
                });
                await profileData.save().catch(console.error);
                console.log("New log created and saved!");

                targetMsg.reply({
                  embeds: [hottakesEmbed]
                });
              } else if (interaction.customId === "otherchannelpicked") {
                const otherChanEmbed = new EmbedBuilder()
                  .setColor("White")
                  .setTitle("📕  Channel Rules Reminder")
                  .setDescription(
                    `Hey there, ${targetUser.toString()}!\n\nWe generally pride ourselves on having a neatly organized server structure, with each channel having it's own designated purpose. You can find specific rules for every channel usually at the top of your screen by clicking on the channel name. Usually, it will just be a designated purpose for the channel, but that's what you need to pay attention to.\n\n[This message](${targetMsg.url
                    }) was potentially in disregard of a channel's specific purpose. **This isn't a warning,** but just some advice! Some common Rule 7 / Misusing Channels violations can be found by pressing the button below.`
                  )
                  .setFooter({
                    text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
                  });

                let profileData = new infractionData({
                  CaseID: 99999,
                  TargetID: targetMsg.author.id,
                  IssuerID: interaction.user.id,
                  InfractionType: "Rule Reminder",
                  Date: Date.now(),
                  Reason: `Channel Rules Reminder: ${targetMsg.url}`,
                });
                await profileData.save().catch(console.error);
                console.log("New log created and saved!");

                targetMsg.reply({
                  embeds: [otherChanEmbed],
                  components: [infoRow]
                });
              }

              interaction.update({
                content:
                  "Reminder Sent! Thank you for doing your part to keep the server tidy.",
                embeds: [],
                components: [],
              });
            });
        } else if (interaction.customId === "r1") {
          const r1Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule One Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. We understand that you may hold tightly to your convictions, feel strongly in your beliefs, think the other side may be misguided, or you simply don't like someone. However, none of that is an excuse to be disrespectful, and it goes directly against our mission to try to bring people together.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 1 - Be Respectful`" +
              `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R1 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r1Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r2") {
          const r2Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule Two Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. We understand that you may hold tightly to your convictions, feel strongly in your beliefs, think the other side may be misguided, or you simply don't like someone. However, none of that is an excuse to pick fights with the other side just for the purpose of instigating something.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 2 - No Instigation`" +
              `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R2 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r2Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r3") {
          const r3Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule Three Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. Harassment of any kind — whether it is in a channel in our server, in DMs, or stemming from our community — is a direct barrier to that goal, and it is also against Discord's Terms of Service / Community Guidelines. We take genuine harassment very seriously!\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 3 - No Harassment`" +
              `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R3 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r3Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r4") {
          const r4Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule Four Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\n In this server we support free speech and free exchange of ideas, but there is a limit to how far this applies. Generally, we do NOT allow for the advocation of or glorification of violent extremism or extremists, or other rhetoric that seeks to undermine our ability to discuss and solve problems together. Please read the full text of Rule 4 for more information on what is not allowed.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`" +
              "Rule 4 - No Political Extremism" +
              "`" +
              `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R4 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r4Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r5") {
          const r5Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule Five Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nWhile we do support free speech and free exchange of ideas, bigotry is an barrier to supporting civil discourse and that free exchange of ideas. We understand you may have harsh opinions about certain people or groups of people in politics, but you should try to avoid holding those obstinate opinions or displaying them in a way that will produce bad faith arguments and cause trouble or harm members of our server.\n\n` +
              `[This message](${targetMsg.url}) was potentially in violation of ` +
              "`Rule 5 - No Bigotry`" +
              ", *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R5 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r5Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r6") {
          const r6Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule Six Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nRule 6 is a very important rule to abide by. Not only is racist, sexist, and other similar kinds of remarks against our rules because it is nothing less than a barrier to civil discussion, it is also against Discord's Community Guidelines. We are also obligated via Discord's Community Guidelines to protect a number of protected characteristics, which can be found [here](https://discord.com/safety/hateful-conduct-policy-explainer)."` +
              `\n\n[This message](${targetMsg.url}) ` +
              "was potentially in violation of `Rule 6 - No Racism, Sexism, or Discrimination`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R6 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r6Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r7") {
          const r7Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 7 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nWe have a lot of channels in this server that serve a lot of purposes. Therefore, we try to keep people and conversations organized and used in the proper places. It's important to avoid shitposting or memeing in the wrong channel, or talking about politics in the wrong channel, too! We're trying to build a community as much as we are building a place for civil discourse and debate.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 7 - No spam, NSFW, or misusing channels`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R7 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r7Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r8") {
          const r8Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 8 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nDon't post invite links, advertise, or send users unwanted content without their consent in our channels or through DMs. Furthermore, be sure to abide by all of Discord's [Community Guidelines](https://discord.com/guidelines) and [Safety Policies](https://discord.com/safety-policies).\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 8 - Unsolicited Content is prohibited`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R8 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r8Embed]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r9") {
          const r9Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 9 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nMainly in order to stay in line with Discord's Community Guidelines, we require our users to ensure that their profile on this server does not include any rule-violating content. This means anything that violates our rules, or Discord's Community Guidelines or Safety Policies. Please check over your profile and make sure there are no issues!`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R9 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r9Embed]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r10") {
          const r10Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 10 Reminder")
            .setDescription(`Hey there, ${targetUser.toString()}!\n\We have Rule 10 in place specifically to prevent kinds of language which have malicious intent, but may not violate other rules. There are ways to have debates and discussions without unnecessarily demeaning an entire group of people or other users in this server. You can have fundamental disagreements over beliefs, lifestyles, and even the basic fundamentals of your worldviews without violating the rules. \n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 10 - Malicious Content and Intent`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R10 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r10Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r11") {
          const r11Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 11 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nDisinformation is a touchy subject, but we take it very seriously here. As we strive to have productive, civil, and meaningful debates, the spreading of misinformation (on any topic) is dangerous to that mission. This isn't a political thing, it's just a matter of whether or not you are actively attempting to spread blatantly false information in our server that may cause harm to people or institutions in any way. We have even completely banned some topics from being discussed because of their tendency to devolve into incivility and disinformation.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 11 - No Disinformation`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R11 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r11Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r12") {
          const r12Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑  Rule 12 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nAs we strive to provide a platform that everyone of all political perspectives can communicate, debate, and discuss in, we recognize that there are some topics which consistently devolve into rule-violating behavior or toxicity. Thus, we have assembled a list of topics that will come with heavier punishments (heavily moderated topics) and those which are outright banned for the sake of ensuring this server is a friendly and productive place for all.\n\n[This message](${targetMsg.url
              }) was potentially in violation of ` +
              "`Rule 12. Heavily Moderated and Banned Topics`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R12 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r12Embed],
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });
        } else if (interaction.customId === "r13") {
          const r13Embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑   Rule 13 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}! \n\nIn Operation Politics, we strive to have good faith discussions and debates at all times. This allows us to facilitate a productive and meaningful environment by which we can have good and civil attitudes and behaviors, and be able to build a community that will work together to shed some of the toxicity and animosity found in modern American politics. \n\n[This message](${targetMsg.url}) was potentially in violation of the spirit of Rule 13 *(or this was sent as a friendly reminder!)*, so please visit <#775838975755681842> and ensure you are not violating the rules.`
            )
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `R13 Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [r13Embed],
            components: [infoRow]
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });


        } else if (interaction.customId === "englishonly") {

          const englishEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("📑   Language Rules Reminder")
            .setDescription(`Hey there, ${targetUser.toString()}! \n\nThis is just a simple reminder to please post content in English. This includes stuff you say, as well as youtube videos, articles, and various links. This is primarily an American-based politics server, and while we do have a global audience too, most people here only speak English. \n\nOn top of that, it's difficult for us to effectively moderate any non-English content. While we may allow leniency on conversations or things said in languages we can moderate (a lot of our staff are bilingual or multilingual!), having conversations in non-English languages will likely only be tolerated for casual discussions and not debates.`)
            .setFooter({
              text: "This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.",
            });

          let profileData = new infractionData({
            CaseID: 99999,
            TargetID: targetMsg.author.id,
            IssuerID: interaction.user.id,
            InfractionType: "Rule Reminder",
            Date: Date.now(),
            Reason: `English Only Reminder: ${targetMsg.url}`,
          });
          await profileData.save().catch(console.error);
          console.log("New log created and saved!");

          targetMsg.reply({
            embeds: [englishEmbed],
          });

          interaction.update({
            content:
              "Reminder Sent! Thank you for doing your part to keep the server tidy.",
            embeds: [],
            components: [],
          });

        }


      });
  },
};
