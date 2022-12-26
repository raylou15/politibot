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

    const pickaRule = new EmbedBuilder()
      .setColor("White")
      .setTitle("📕  Rules Reminder")
      .setDescription(
        `Do you think someone is violating a rule? You can give them a gentle reminder in a good faith way by sending them a message reminder through this prompt. While rules and their enforcement is ultimately at the determination of staff, you can try to give someone a nudge in the right direction.\n\n❕ Be sure to double check <#775838975755681842>, or your respective channel's rules, and make sure you are citing the right rule/ruleset ❕`
      )
      .addFields({
        name: "Targeted User / Message:",
        value: `${targetUser.toString()} \n[Click to jump to message](${
          targetMsg.url
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
                    `Hey there, ${targetUser.toString()}!\n\n<#1006354250017808424> is generally for more serious, structured, and formal debates. While it's not expected that *every* topic at *all* times will adhere to this standard, we expect you to try to do your best to contribute to these discussions in the most meaningful, productive, and good faith way. If you're looking for more informal debate or discussion, try <#964239900620759070>!\n\n[This message](${
                      targetMsg.url
                    }) was potentially in disregard of the channel's rules, or the thread's designated subject. You can check out some common mistakes and important resources below to help you participate in this server better.`
                  )
                  .addFields(
                    {
                      name: "✅  Good Faith Discussion and Discourse",
                      value:
                        "Generally speaking, good faith discussions are ones which are respectful, open-minded, and honest. Bad faith are the opposite - arguing with a hidden agenda, a closed mind, disingenuous behavior, or lacks honesty and simple respect. [You can read more by clicking here.](https://www.cato.org/sites/cato.org/files/2020-07/Good_Faith-vs-Bad_Faith-Arguments_or_Discussions.pdf)",
                      inline: false,
                    },
                    {
                      name: "📝  Cite Your Sources",
                      value:
                        "Unless the discussion is about a purely ideological or semantical argument, you should do your best to back up your claims. You can easily find lots of good citations through [Google Scholar](https://scholar.google.com/), or use places like [Pew Research Center](https://www.pewresearch.org/), [American Political Science Association](https://www.apsanet.org/), or others to find good political research.",
                      inline: true,
                    },
                    {
                      name: "🗣️  Practice Good Debating Techniques",
                      value:
                        "You should do your best to be honest, genuine, and well-spoken during these debates. This mean [avoiding debate fallacies](https://thebestschools.org/magazine/15-logical-fallacies-know/) as much as possible, [practicing good formal debating methods](https://www.sfu.ca/cmns/130d1/HOWTODEBATE.htm#:~:text=be%20stared%20at.-,Content,the%20other%20side%E2%80%99s%20case%20to%20be%20flawed%20in%20the%20key%20areas.,-Sources) when possible, and [be sure to listen to your opponent and make reasonable arguments.](https://blogs.scientificamerican.com/observations/try-these-5-techniques-to-make-your-next-political-argument-fruitful/)",
                      inline: true,
                    },
                    {
                      name: "👁️‍🗨️  Stay On Topic",
                      value:
                        "Don't try to diverge the discussion unless you are certain it is still relevant and able to be tied back into the main point of the discussion at any time. Other people may want to participate too, but may be confused by the ongoing discussion seemingly being unrelated to the topic's main purpose.",
                      inline: false,
                    }
                  )
                  .setFooter({
                    text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
                  });

                targetMsg.reply({
                  embeds: [seriousEmbed],
                });
              } else if (interaction.customId === "hottakes") {
                const hottakesEmbed = new EmbedBuilder()
                  .setColor("White")
                  .setTitle("📕  Hot Takes Rules Reminder")
                  .setDescription(
                    `Hey there, ${targetUser.toString()}!\n\n<#1007831196874575902> is a channel for making unpopular (but not rule-violating) opinions and debating with folks about it. These posts can be related to politics, food, games, or generally anything. However, shitposting and derailing conversations isn't allowed. Also, do your best to be respectful, no matter how down and dirty you think someone's takes are.\n\nEverything posted in this channel is all in good faith and good fun, keep it that way!\n\n[This message](${
                      targetMsg.url
                    }) was potentially in violation of the server rules, channel rules, or thread topic. Be careful!`
                  )
                  .setFooter({
                    text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
                  });

                targetMsg.reply({
                  embeds: [hottakesEmbed],
                });
              } else if (interaction.customId === "otherchannelpicked") {
                const otherChanEmbed = new EmbedBuilder()
                  .setColor("White")
                  .setTitle("📕  Channel Rules Reminder")
                  .setDescription(
                    `Hey there, ${targetUser.toString()}!\n\nWe generally pride ourselves on having a neatly organized server structure, with each channel having it's own designated purpose. You can find specific rules for every channel usually at the top of your screen by clicking on the channel name. Usually, it will just be a designated purpose for the channel, but that's what you need to pay attention to.\n\n[This message](${
                      targetMsg.url
                    }) was potentially in disregard of a channel's specific purpose. **This isn't a warning,** but just some advice! Some common Rule 7 / Misusing Channels violations include:`
                  )
                  .addFields(
                    {
                      name: "*Posting several memes in #general*",
                      value:
                        'A pretty simple mistake! One or two memes is fine, but if you want to post a lot or post them in our designated "meme" channel, head to <#775867278016118794>.',
                      inline: true,
                    },
                    {
                      name: "*Unrelated Discussion to Topic*",
                      value:
                        "Even if you're talking about politics outside of <#760275642150420523>, each channel and/or thread in our Forum Channels have a specific purpose. Keep an eye out!",
                      inline: true,
                    },
                    {
                      name: "*Discussing politics in #general, or general discussion in a political channel*",
                      value:
                        "As per the description of the channel, we do **not** allow political discourse in <#760275642150420523>. It's a place to hang out, talk about your day, and make friends - not for the nitty gritty of political discourse. Head to <#964239900620759070> or check out our other specialized channels! Likewise, we don't allow general / unrelated discussion that isn't related to a channel's specific purpose.",
                    },
                    {
                      name: "*Do you have any questions?*",
                      value:
                        "If you're unsure about what went wrong, your best course of action is to open a ticket in <#999439440273473657> and get directly in touch with the Moderation team. You can ask questions about the rules, channel purposes/usages, and more there.",
                    }
                  )
                  .setFooter({
                    text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
                  });

                targetMsg.reply({
                  embeds: [otherChanEmbed],
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
            .setTitle("1️⃣  Rule One Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. We understand that you may hold tightly to your convictions, feel strongly in your beliefs, think the other side may be misguided, or you simply don't like someone. However, none of that is an excuse to be disrespectful, and it goes directly against our mission to try to bring people together.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 1 - Be Respectful`" +
                `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .addFields(
              {
                name: "❔ What even is a Rule 1 violation?",
                value:
                  "Some common examples of Rule 1 Violations include being insulting towards other users, insulting them for a political viewpoint that they hold, or being generally aggressive/hostile in a debate or casual discussion.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "It's pretty simple — just be respectful! No matter how much you may disagree with a person, treat them with the same respect and dignity you would expect out of anyone else. At the end of the day, we're all people. Be nice!",
                inline: true,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r1Embed],
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
            .setTitle("2️⃣  Rule Two Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. We understand that you may hold tightly to your convictions, feel strongly in your beliefs, think the other side may be misguided, or you simply don't like someone. However, none of that is an excuse to pick fights with the other side just for the purpose of instigating something.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 2 - Do not instigate fights`" +
                `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .addFields(
              {
                name: "❔ What even is a Rule 2 violation?",
                value:
                  "Some common examples of Rule 2 Violations include saying intentionally inflammatory/derogatory statements that are charged in a way to start a fight with a particular ideological viewpoint, poking fun at people's opinions, lifestyles, etc in order to start a fight, or other similar examples.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Ultimately, be respectful. Let conversations about political topics arise naturally in some way or another, and if someone doesn't want to engage in what you're trying to talk about, don't prod and poke at them in order to get something out of them for the purpose of argument.",
                inline: true,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r2Embed],
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
            .setTitle("3️⃣  Rule Three Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nOne of our primary goals in this server is to encourage productive, meaningful, and positive debate and discourse over politics. Harassment of any kind — whether it is in a channel in our server, in DMs, or stemming from our community — is a direct barrier to that goal, and it is also against Discord's Terms of Service / Community Guidelines. We take genuine harassment very seriously!\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 3 - No general harassment`" +
                `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .addFields(
              {
                name: "❔ What even is a Rule 3 violation?",
                value:
                  "Simply put, Rule 3 covers harassment of any form. Sexual, verbal, emotional, physical, or otherwise that may happen within our server, outside of our server, or stemming from our server (such as real life). Targeting or harassing someone for their political views, opinions, or otherwise is strictly prohibited.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Avoid harassing people over their views, opinions, or lifestyles. If you engage with this user outside of the community, do not harass them over anything *because of* the community, i.e. learning about their views, opinions, or lifestyles. And, if you are a member of our Student Hubs, don't stalk, harass, assault, or otherwise to other members of our community.",
                inline: true,
              },
              {
                name: "🎓  I'm a member of a Student Hub connected to this server, what about me?",
                value:
                  "We have methods and systems in place to protect some of our most vulnerable users. We understand that you may run into people you met from our community while on campus, or you may have the desire to meet some friends you've made here and hang out with them. That's fine — but, if the relationship or knowing who the other person is devolves into any form of harassment that we are alerted to, we *will* take appropriate steps in order to ensure the safety of our community members. We have a zero tolerance policy for this kind of harassment, and you can read more about what we are able to do / will do [at this link.](https://docs.google.com/document/d/1piZa-9qhvMvN9x6GEd_umpUfzi8DogfoT-14NwPT0-8/edit?usp=sharing)",
                inline: false,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r3Embed],
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
            .setTitle("4️⃣  Rule Four Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nWhile we do support free speech and free exchange of ideas, there are *some* things that we *have* to enforce in order to abide by Discord's Terms of Service / Community Guidelines and also just to generally encourage bipartisan, civil methods of addressing issues we face as a society today. While we do not consider Nazism, Socialism, Fascism, or Communism to be \"Political Extremism\" for the purpose of Rule 4, there are some things that are covered under this rule.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`" +
                "Rule 4 - No Political Extremism" +
                "`" +
                `, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries.`
            )
            .addFields(
              {
                name: "❔ What even is a Rule 4 violation?",
                value:
                  'Rule 4 covers partisan misinformation *(also partly covered by Rule 11)*, supporting violent extremist groups *(such as ANTIFA and the Proud Boys)*, suggesting the exclusion of a group from political participation or society *(such as saying Republicans should not be allowed to be in office)*, advocating for the violent overthrow of government, or other posts similar to these criteria which may be deemed "Political Extremism" in an American context.',
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Try to keep some of your most extreme ideological views out of our server if they are incompatible with this rule. Generally speaking, if you're advocating for any of these things, you've probably already lost the discussion. Focus on making meaningful arguments about our society and our system that can be solved in realistic and pragmatic ways, even if you're speaking from the viewpoint of a Communist, Fascist, or otherwise.",
                inline: true,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r4Embed],
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
            .setTitle("5️⃣  Rule Five Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nWhile we do support free speech and free exchange of ideas, bigotry is an important part of supporting civil discourse and that free exchange of ideas. We understand you may have harsh opinions about certain people or groups of people in politics, but you should try to avoid holding those obstinate opinions or displaying them in a way that will produce bad faith arguments and cause trouble or harm members of our server.\n\n` +
                `[This message](${targetMsg.url}) was potentially in violation of ` +
                "`Rule 5 - No Bigotry`" +
                ", *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .addFields(
              {
                name: "❔ What even is a Rule 5 violation?",
                value:
                  "Generally speaking, being prejudicial or obstinate towards a person or group of people regarding their political views, political affiliations, lifestyles, or otherwise.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Don't senselessly hate on people for being different and not seeing things the same way you do. We're all people at the end of the day, and *all* of our voices matter.",
                inline: true,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r5Embed],
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
            .setTitle("6️⃣  Rule Six Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nRule 6 is a very important rule to abide by. Not only is racist, sexist, and other similar kinds of remarks against our rules because it is nothing less than a barrier to civil discussion, it is also against Discord's Terms of Service and Community Guidelines.` +
                `\n\n[This message](${targetMsg.url}) ` +
                "was potentially in violation of `Rule 6 - No Racism, Sexism, etc`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .addFields(
              {
                name: "❔ What even is a Rule 6 violation?",
                value:
                  "Racist or Sexist comments, racial slurs (of any kind and to any degree), or other offensive content that discriminates or prejudices against people based on their skin color, ethnicity, sex, sexual orientation, or other unchangeable factors about their personhood.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Simply be nice to people. You don't need to use slurs, and you should generally treat people as equals regardless of their physical or genetic makeups. Don't be discriminatory or predjudicial, basically.",
                inline: true,
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r6Embed],
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
            .setTitle("7️⃣  Rule 7 Reminder")
            .setDescription(
              `Hey therem ${targetUser.toString()}!\n\nWe have a lot of channels in this server that serve a lot of purposes. Therefore, we try to keep people and conversations organized and used in the proper places. It's important to avoid shitposting or memeing in the wrong channel, or talking about politics in the wrong channel, too! We're trying to build a community as much as we are building a place for civil discourse and debate.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 7 - No spam, NSFW, or misusing channels`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .addFields(
              {
                name: "❔ What even is a Rule 7 violation?",
                value:
                  "Shitposting in the middle of a serious conversation, spamming memes or images in inappropriate channels, discussing politics in <#760275642150420523> or off topic discussion in a political channel, posting NSFW, etc.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Don't do any of the stuff listed to the left. Channels have purposes in their title and description - pay attention to them.",
                inline: true,
              },
              {
                name: "❌  Why no NSFW??? Why can't I post memes wherever I want? Where is the memes channel?",
                value:
                  "As a public server on Server Discovery, we cannot have NSFW content of any kind. Memes and picture spam can be annoying, so we try to keep it all in <#775867278016118794>, which is our dedicated meme channel. We don't have a #meme channel because in the past a channel with that title attracted a lot of degenerates who we ended up having to immediately ban.",
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r7Embed],
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
            .setTitle("8️⃣  Rule 8 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nDon't post invite links, advertise, or send users unwanted content without their consent in our channels or through DMs.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 8 - Unsolicited Content is prohibited`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r8Embed],
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
            .setTitle("9️⃣  Rule 9 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nWe know that Discord's Terms and Service and Community Guidelines are a lot to read and hard to understand, but it's very important to try your best. While our rules typically cover all bases with the ToS/CG, there may be some instances where they do not.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 9 - All Discord TOS and Community Guidelines must be followed`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r9Embed],
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
            .setTitle("🔟  Rule 10 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nMainly in order to stay in line with Discord's ToS, we require our users to ensure that their profile on this server does not include any rule-violating content. This means anything that violates our rules, or Discord's ToS/CG. Please check over your profile and make sure there are no issues!`
            )
            .addFields({
              name: "✅  How can I avoid violating this rule?",
              value:
                "Check and make sure your profile does not have any allusions to Hitler, Stalin, the Proud Boys, ANTIFA, or other extremist individuals/groups, including links to documents or webpages. No slurs, offensive content, or otherwise is allowed in your name, status, profile, banner, about me, or otherwise. This also includes porn, gore, and general NSFW content. **Please be aware that we will report your account to Discord if any issues are not fixed.**",
            })
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r10Embed],
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
            .setTitle("1️⃣1️⃣  Rule 11 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nDisinformation is a touchy subject, but we take it very seriously here. As we strive to have productive, civil, and meaningful debates, the spreading of misinformation (on any topic) is dangerous to that mission. This isn't a political thing, it's just a matter of whether or not you are actively attempting to spread blatantly false information in our server that may cause harm to people or institutions in any way. We have even completely banned some topics from being discussed because of their tendency to devolve into incivility and disinformation.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 11 - Do not deliberately disseminate disinformation`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .addFields(
              {
                name: "❔ What even is a Rule 11 violation?",
                value:
                  "Discussing prohibited topics *(Election Fraud in 2020 or 2016, QAnon Conspiracy Theories, COVID-19 Hoax Conspiracy Theories, and Genocide Denial)*, or posting blatantly infactual information with the purpose to intentionally deceive or promote a political agenda with no factual basis.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Check your sources, double-check your facts, and avoid banned topics.",
                inline: true,
              },
              {
                name: "❌  This sounds like liberal politics... who decides what is or is not disinformation?",
                value:
                  "Regardless of the politics of the word 'disinformation' in recent years, we have an obligation to abide by Discord's Terms of Service and Community Guidelines which prohibit content that is factually inaccurate and may cause harm to individuals or groups of people. Generally speaking, if we believe you may be violating Rule 11, Moderators may give you a chance to explain yourself or defend what you are saying with reasonable facts and evidence. If you cannot do that and provide serious, reputable sources to back up your claims and your claims have the potential to cause harm to individuals or groups of people or otherwise, then it is a violation of Rule 11.",
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r11Embed],
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
            .setTitle("1️⃣2️⃣  Rule 12 Reminder")
            .setDescription(
              `Hey there, ${targetUser.toString()}!\n\nAs we strive to provide a platform that everyone of all political perspectives can communicate, debate, and discuss in, we recognize that malicious intent in your messaging is a big part in whether or not you're acting in good faith. Whether intended directly or indirectly, content meant to harass, demean, invalidate, or cause harm to people because of their beliefs, personhoods, or otherwise for political or personal reasons is prohibited. As such, we've even put a list of topics which will be **heavily** moderated for malicious intent whenever they are seen by Moderators.\n\n[This message](${
                targetMsg.url
              }) was potentially in violation of ` +
                "`Rule 12. Heavily Moderated Topics & Malicious Intent`, *(or this message was sent just as a general reminder!)* so we encourage you to revisit the rule in <#775838975755681842> and make sure you're not stepping out of boundaries."
            )
            .addFields(
              {
                name: "❔ What even is a Rule 12 violation?",
                value:
                  "General bad faith behavior, incivility, and passive-aggressive behavior includes Rule 12 violations. An additional example of this would be invalidating the existence of transgender people in a discussion with or surrounding transgender people, or otherwise trying to invalidate or demean them for existing. Another would include trying to invalidate, demean, or harass individuals on either side of the political aisle for politically-charged riots, such as the 2020 BLM riots or the January 6th Capitol riot.",
                inline: true,
              },
              {
                name: "✅  How can I avoid violating this rule?",
                value:
                  "Avoid those touchy, sensitive topics listed under Rule 11 entirely, if you cannot be civil about it. It's possible to have disagreements, morally, ethically, and politically, without having to resort to bad faith behavior and passive aggressive comments to harass and demean people.",
                inline: true,
              },
              {
                name: "❌  This sounds like liberal politics... who decides what is or is not disinformation?",
                value:
                  "Regardless of the politics of the word 'disinformation' in recent years, we have an obligation to abide by Discord's Terms of Service and Community Guidelines which prohibit content that is factually inaccurate and may cause harm to individuals or groups of people. Generally speaking, if we believe you may be violating Rule 12, Moderators may give you a chance to explain yourself or defend what you are saying with reasonable facts and evidence. If you cannot do that and provide serious, reputable sources to back up your claims and your claims have the potential to cause harm to individuals or groups of people or otherwise, then it is a violation of Rule 11.",
              }
            )
            .setFooter({
              text: "This isn't a warning, it's a user-generated reminder about the rules! Take it in good faith and don't argue about it in public chats.",
            });

          targetMsg.reply({
            embeds: [r12Embed],
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
