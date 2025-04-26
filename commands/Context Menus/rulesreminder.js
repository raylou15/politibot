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
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const ms = require("ms");
const { container } = require("googleapis/build/src/apis/container");

function updateInteractionSent(interaction) {
  interaction.update({
    components: [
      new ContainerBuilder()
        .setAccentColor([255, 255, 255])
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("Reminder Sent! Thank you for doing your part to keep the server tidy.")
        ),
    ],
    flags: [
      MessageFlags.IsComponentsV2,
      MessageFlags.Ephemeral
    ],
  });
}

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
        .setStyle(ButtonStyle.Primary)
    )

    const infoButton = new ButtonBuilder()
      .setCustomId("rulesreminderinfo")
      .setLabel("Get More Info")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("ℹ️")

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
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r2")
        .setLabel("Rule 2")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r3")
        .setLabel("Rule 3")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r4")
        .setLabel("Rule 4")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r5")
        .setLabel("Rule 5")
        .setStyle(ButtonStyle.Primary)
    );

    const rulesList2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("r6")
        .setLabel("Rule 6")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r7")
        .setLabel("Rule 7")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r8")
        .setLabel("Rule 8")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r9")
        .setLabel("Rule 9")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r10")
        .setLabel("Rule 10")
        .setStyle(ButtonStyle.Primary)
    );

    const rulesList3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("r11")
        .setLabel("Rule 11")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r12")
        .setLabel("Rule 12")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("r13")
        .setLabel("Rule 13")
        .setStyle(ButtonStyle.Primary)
    );

    const rulesList4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("generalreminder")
        .setLabel("General Reminder")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("channelrules")
        .setLabel("Channel Rules")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("englishonly")
        .setLabel("English Only")
        .setStyle(ButtonStyle.Success)
    );


    const pickaRuleContainer = new ContainerBuilder()
      .setAccentColor([255, 255, 255])
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        [
          `### 📕  Rules Reminder`,
          `This menu is for sending a rules reminder to someone. You can pick a specific rule, or send a general reminder.\n`,
          `**-# Be sure to double check <#775838975755681842>, or your respective channel's rules, and make sure you are citing the right rule/ruleset.**`,
        ].join("\n")
      ))
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(2))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(
        [
          `**Targeted User / Message:**`,
          `${targetUser.toString()} \n${targetMsg?.url ? `[Click to jump to message](${targetMsg.url})` : 'Message unavailable.'}`,
        ].join("\n")
      ))
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(2))
      .addActionRowComponents(
        [
          rulesList1,
          rulesList2,
          rulesList3,
          rulesList4,
          cancelButton
        ]
      )
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# If you clicked this by mistake, or chose the wrong message, click "Cancel". This prompt times out in 2 minutes.`))

    const sentMsg = await interaction.reply({
      components: [
        pickaRuleContainer,
      ],
      flags: [
        MessageFlags.IsComponentsV2,
        MessageFlags.Ephemeral
      ],
      withResponse: true,
    });

    interaction.channel
      .awaitMessageComponent({
        filter,
        componentType: ComponentType.Button,
        time: 1200000,
      })
      .then(async (interaction) => {
        if (interaction.customId === "cancelrulesreminder") {
          interaction.update({
            components: [new ContainerBuilder().setAccentColor([255, 255, 255]).addTextDisplayComponents(new TextDisplayBuilder().setContent("Prompt Cancelled"))],
            flags: [
              MessageFlags.IsComponentsV2,
              MessageFlags.Ephemeral
            ],
          });
        } else if (interaction.customId === "generalreminder") {

          const generalRulesReminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  General Rules Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `Operation Politics strives on civil discourse and principles of mutual respect and a shared desire to promote healthy debate. In order for this to happen, it's integral that all users try and follow **all server rules**, because there cannot be productive dialogue if not everyone participates in good faith. You can check and read our rules in <#775838975755681842>, or check the specific Channel Guidelines or Channel Description for whichever channel you may be in.`
              )
            )
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *Moderators have the final say-so on what is or is not a rule violation. This is not a warning, this is just a reminder.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
              .addComponents(
                [
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/760275642150420520/775838975755681842`)
                    .setLabel("Rules & Info Channel")
                    .setEmoji("📝"),
                ]
              )
            )

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

          targetMsg.reply({
            components: [generalRulesReminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })
          updateInteractionSent(interaction);

        } else if (interaction.customId === "channelrules") {

          const pickaChannel = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("seriousdiscussion")
              .setLabel("👤︱serious-discussion")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("hottakes")
              .setLabel("🔥︱hot-takes")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("otherchannelpicked")
              .setLabel("Other Channel")
              .setStyle(ButtonStyle.Success)
          );

          interaction.update({
            components: [new ContainerBuilder()
              .setAccentColor([255, 255, 255])
              .addTextDisplayComponents(new TextDisplayBuilder().setContent(
                "Which channel are you trying to remind people the rules for?"
              ))
              .addActionRowComponents([
                pickaChannel,
                cancelButton,
              ])
            ],
            flags: [
              MessageFlags.IsComponentsV2,
              MessageFlags.Ephemeral
            ],
          });

          interaction.channel
            .awaitMessageComponent({
              filter,
              componentType: ComponentType.Button,
              time: 1200000,
            })
            .then(async (interaction) => {
              if (interaction.customId === "cancelrulesreminder") {
                interaction.update({
                  components: [new ContainerBuilder().setAccentColor([255, 255, 255]).addTextDisplayComponents(new TextDisplayBuilder().setContent("Prompt Cancelled"))],
                  flags: [
                    MessageFlags.IsComponentsV2,
                    MessageFlags.Ephemeral
                  ],
                })
              } else if (interaction.customId === "seriousdiscussion") {
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

              updateInteractionSent(interaction);
            });
        } else if (interaction.customId === "r1") {

          const r1Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 1 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 1, or heading in the direction of violating the rule. This is not a warning, but just a reminder to be respectful and civil in your conversations.`
            )

            )
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 1 - Be Respectful**`,
                `> **-# You will find people in this server with differing opinions, lifestyles, and points of view. Disrespectful behavior will not be tolerated. This is the foundation of productive and welcoming discourse.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
              .addComponents(
                [
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetMsg.url)
                    .setLabel("Flagged Message")
                    .setEmoji("📨"),
                  infoButton
                ]
              )
            )

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
            components: [r1Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r2") {

            const r2Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 2 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 2, or heading in the direction of violating the rule. This is not a warning, but just a reminder to be respectful and civil in your conversations.`
            )

            )
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 2 - No Instigation**`,
                `> **-# Avoid making comments, baiting, or taking actions aimed solely at provoking, instigating, or antagonizing others into fights or arguments based on their beliefs, roles, or otherwise.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
              .addComponents(
                [
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetMsg.url)
                    .setLabel("Flagged Message")
                    .setEmoji("📨"),
                  infoButton
                ]
              )
            )

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
            components: [r2Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r3") {

          const r3Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 3 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 3, or heading in the direction of violating the rule. This is not a warning, but just a reminder to be respectful and civil in your conversations.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 3 - No Harassment**`,
                `> **-# Targeting or harassing someone for their political views, opinions, or otherwise is strictly prohibited. Furthermore, harassment stemming from our community in any form (physical, verbal, sexual, etc.) that takes place in our community, in DMs, or off-platform is explicitly prohibited.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
              .addComponents(
                [
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetMsg.url)
                    .setLabel("Flagged Message")
                    .setEmoji("📨"),
                  infoButton
                ]
              )
            )

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
            components: [r3Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r4") {

          const r4Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 4 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 4, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid treading into political extremism.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 4 - No Political Extremism**`,
                `> **-# Political extremism includes supporting or glorifying violent extremist organizations, groups, figures, actions, events or movements; advocating for the exclusion of specific groups, political parties, or others from government or society; promoting the violent overthrow of the government; or making statements, generalizations, or posts that may be regarded as "political extremism" in an American context due to being significantly outside the scope of acceptable policies or topics of discussion.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
              .addComponents(
                [
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(targetMsg.url)
                    .setLabel("Flagged Message")
                    .setEmoji("📨"),
                  infoButton
                ]
              )
            )

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
            components: [r4Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r5") {

          const r5Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 5 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 5, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid treading into prejudicial or hateful behavior or comments.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 5 - No Bigotry**`,
                `> **-# Engaging in prejudicial behavior or using hateful language against people or groups based on their political views, opinions, backgrounds, or lifestyles impedes constructive discussion and will not be tolerated.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r5Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r6") {

          const r6Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 6 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 6, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid making discriminatory comments or posts.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 6 - No Racism, Sexism, or Discrimination**`,
                `> **-# Discriminatory comments or posts, hate speech, or other actions based on race, gender, sexual orientation, religion, class, ethnicity, or other protected characteristics as defined by Discord’s [Hateful Conduct Policy](https://discord.com/safety/hateful-conduct-policy-explainer) are prohibited. This rule is essential for creating a safe environment for all members.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r6Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r7") {

          r7reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 7 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 7, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid making spammy posts or misusing channels.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 7 - No Spam, NSFW, or Misusing Channels**`,
                `> **-# Spamming, shitposting, posting NSFW content, or misusing channels for purposes or conversations besides their designated purpose is prohibited. Each channel has a labeled purpose in the description at the top of the screen - pay attention to it and be mindful of where you're posting or using bot commands.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r7reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          })

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r8") {

          r8reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 8 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 8, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid making unsolicited posts or sending unsolicited DMs, and follow all Communiuty Guidelines.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 8 - Unsolicited Content, Community Guidelines**`,
                `> **-# All of Discord’s [Community Guidelines](https://discord.com/guidelines) and [Safety Policies](https://discord.com/safety-policies) must be followed. This also implies that unsolicited advertisements, messages, spam, or other content delivered to members within this server or through DMs is strictly prohibited.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r8reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r9") {

          const r9Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 9 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 9, or heading in the direction of violating the rule. This is not a warning, but just a reminder to make sure your profile is in line with the server rules.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 9 - Profiles Must Comply With Rules**`,
                `> **-# Any content in any part of a user’s profile that violates our rules or Discord’s Community Guidelines is prohibited.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r9Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r10") {
          
          const R10Reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 10 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 10, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid making malicious comments or posts.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 10 - Malicious Content and Intent**`,
                `> **-# Content that is intentionally and explicitly malicious and intended to harass, demean, invalidate, or cause harm to people because of their beliefs, personhoods, or otherwise for personal or political reasons is prohibited.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [R10Reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r11") {

          const r11reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 11 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 11, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid posting disinformation.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 11 - No Disinformation**`,
                `> **-# Any conduct with intent to convey false or misleading information, claims, rumors, or conspiracy theories is prohibited. This includes promoting political agendas with no factual standing, harmful or dangerous information or behavior, or spreading false or misleading claims about civic processes or that would otherwise undermine civic integrity or suppress civic participation. All content related to public issues, particularly civic or health events, must be factual and based on credible sources to ensure a safe, trustworthy community.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r11reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r12") {

          const r12reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 12 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 12, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid posting content that is related to banned topics, and be careful when discussing heavily moderated topics.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 12 - Heavily Moderated and Banned Topics**`,
                `> **-# The following topics often devolve into malicious content, misinformation, conspiracy theories, or general incivility, and will be heavily moderated with higher degrees of punishment if violations occur:**`,
                `> **-# • LGBTQ+ Issues**`,
                `> **-# • Political Riots/Civic Unrest**`,
                `> **-# • Global Wars or Conflicts**`,
                `\n**-# The following topics are strictly prohibited:**`,
                `**-# • 2016/2020 Election Fraud**`,
               `**-# • COVID-19/Health Conspiracies**`,
                `**-# • Genocide Denial**`,
                `**-# • Race Realism or Related Topics**`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r12reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "r13") {

          const r13reminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  Rule 13 Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating Rule 13, or heading in the direction of violating the rule. This is not a warning, but just a reminder to avoid making posts that are overtly bad faith.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `> **Rule 13 - Bad Faith Discussion**`,
                `> **-# Displaying [bad faith behavior](https://www.cato.org/sites/cato.org/files/2020-07/Good_Faith-vs-Bad_Faith-Arguments_or_Discussions.pdf) includes, but is not limited to, toxicity, intent to dominate or coerce the opposition into compliance or acquiescence, disrespect, intentional dishonesty, abusing debate with logical fallacies, or otherwise not approaching debates with an open mind, good will and respect, and displaying good and true intentions in a good faith manner.**`
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
                infoButton
              ]
            )
          )

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
            components: [r13reminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        } else if (interaction.customId === "englishonly") {

          const englishReminder = new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                `### 📑  English Only Reminder`,
                `Hey there, ${targetUser.toString()}!`,
              ].join("\n")
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `One of your messages is potentially violating the English Only rule. This is not a warning, but just a reminder to please post content in English.`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
                `> **-# Please post all content in English. This includes stuff you say, as well as youtube videos, articles, and various links. This is primarily an American-based politics server, and while we do have a global audience too, most people here only speak English. On top of that, it's difficult for us to effectively moderate any non-English content. While we may allow leniency on conversations or things said in languages we can moderate (a lot of our staff are bilingual or multilingual!), having conversations in non-English languages will likely only be tolerated for casual discussions and not debates.**`
            ))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              `-# *This is a rule reminder generated by a Moderator. This is not an official warning. Take it in good faith, don't argue about it in public chats, and open a ticket if you have any questions.*`
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addActionRowComponents(new ActionRowBuilder()
            .addComponents(
              [
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Link)
                  .setURL(targetMsg.url)
                  .setLabel("Flagged Message")
                  .setEmoji("📨"),
              ]
            )
          )

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
            components: [englishReminder],
            flags: [
              MessageFlags.IsComponentsV2,
            ],
          });

          updateInteractionSent(interaction);

        }


      });
  },
};
