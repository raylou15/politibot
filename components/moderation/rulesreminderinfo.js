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
    time,
  } = require("discord.js");
  const infractionData = require("../../schemas/infractions");
  const ms = require("ms");
  module.exports = {
    name: "rulesreminderinfo",
    description: "Reminders",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {

        const embed = interaction.message.embeds[0]

        if (embed.title.includes("Serious Discussion")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                    "You should do your best to be honest, genuine, and well-spoken during these debates. This mean [avoiding debate fallacies](https://blog.hubspot.com/marketing/common-logical-fallacies) as much as possible, [practicing good formal debating methods](https://www.indeed.com/career-advice/career-development/debate-techniques) when possible, and be sure to listen to your opponent and make reasonable arguments.",
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Channel Rules")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule One")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule Two")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule Three")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                }
              )
              .setFooter({
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule Four")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
            .addFields(
                {
                  name: "❔ What even is a Rule 4 violation?",
                  value:
                    `Rule 4 violations can include a breadth of violations, such as: \n\n • supporting or glorifying violent extremist organizations (i.e. ANTIFA, Proud Boys, Hamas, etc) or violent extremist actors or actions (such as extremist leaders or terrorists); \n • suggesting the exclusion of a group from political participation or society (such as saying liberals shouldn't be allowed to vote); \n • advocating for the violent overthrow of government; \n • or other posts similar to these criteria which may be deemed "Political Extremism" in an American context. `,
                  inline: true,
                },
                {
                  name: "✅  How can I avoid violating this rule?",
                  value:
                    "Keep your most extreme ideological views out of our server if they are incompatible with this rule. Generally speaking, if you're advocating for any of these things, you've probably already lost the discussion. Focus on making meaningful arguments about our society and our system that can be solved in realistic and pragmatic ways, even if you're speaking from the viewpoint of a Communist, Fascist, or otherwise.",
                  inline: true,
                }
              )
              .setFooter({
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule Five")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule Six")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
            .addFields(
                {
                  name: "❔ What even is a Rule 6 violation?",
                  value:
                    "Racist or Sexist comments, racial slurs (of any kind and to any degree), or other offensive content that discriminates or prejudices against people based on their protected characteristics, [as defined by Discord in their Community Guidelines.](https://discord.com/guidelines#:~:text=We%20consider%20the,weight%20and%20size.) Not all of those fall under Rule 6, but the majority do if they are unchangeable factors of their personhood.",
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule 7")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
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
                text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
              });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule 11")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
            .addFields(
                {
                  name: "❔ What even is a Rule 11 violation?",
                  value:
                    "Any conduct with intent to convey false or misleading information, claims, rumors, or conspiracy theories is prohibited. This includes promoting political agendas with no factual standing, harmful or dangerous information or behavior, or spreading false or misleading claims about civic processes or that would otherwise undermine civic integrity or suppress civic participation. All content related to public issues, particularly civic or health events, must be factual and based on credible sources to ensure a safe, trustworthy community.",
                  inline: true,
                },
                {
                  name: "✅  How can I avoid violating this rule?",
                  value:
                    "Check your sources, and double-check your facts. Don't spread disinformation which seeks to undermine civic institutions or civic processes.",
                  inline: true,
                },
                {
                  name: "❌  This sounds like liberal politics... who decides what is or is not disinformation?",
                  value:
                    "Regardless of the politics of the word 'disinformation' in recent years, we have an obligation to abide by Discord's Terms of Service and Community Guidelines which prohibit content that is factually inaccurate and may cause harm to individuals or groups of people. Generally speaking, if we believe you may be violating Rule 11, Moderators may give you a chance to explain yourself or defend what you are saying with reasonable facts and evidence. If you cannot do that and provide serious, reputable sources to back up your claims and your claims have the potential to cause harm to individuals or groups of people or otherwise, then it is a violation of Rule 11.",
                }
            )
            .setFooter({
            text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
            });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule 10")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
            .addFields(
                {
                  name: "❔ What even is a Rule 10 violation?",
                  value:
                    "General bad faith behavior, incivility, and passive-aggressive behavior includes Rule 12 violations. An additional example of this would be invalidating the existence of transgender people in a discussion with or surrounding transgender people, or otherwise trying to invalidate or demean them for existing. Another would include trying to invalidate, demean, or harass individuals on either side of the political aisle for politically-charged riots, such as the 2020 BLM riots or the January 6th Capitol riot.",
                  inline: true,
                },
                {
                  name: "✅  How can I avoid violating this rule?",
                  value:
                    "Avoid those touchy, sensitive topics listed under Rule 12 entirely, if you cannot be civil about it. It's possible to have disagreements, morally, ethically, and politically, without having to resort to bad faith behavior and passive aggressive comments to harass and demean people.",
                  inline: true,
                }
              )
            .setFooter({
            text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
            });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })


        } else if (embed.title.includes("Rule 13")) {
            const infoEmbed = new EmbedBuilder()
            .setTitle(embed.title)
            .setColor(embed.color)
            .addFields(
                {
                  name: "❔ Why does this rule even exist?",
                  value: 'This rule exists because having a platform with open minds, civil discussion, and good faith behavior has always been the backbone of Operation Politics. It is what we try to facilitate in order to separate us out from other servers and platforms, while still trying to provide as much involvement and interaction from ordinary people as possible. We want to provide people a breath of fresh air on the internet!',
                  inline: true
                },
                {
                  name: "✅  How can I avoid violating this rule?",
                  value: "[You can check out this link](https://www.cato.org/sites/cato.org/files/2020-07/Good_Faith-vs-Bad_Faith-Arguments_or_Discussions.pdf) for a brief one-page document explaining some of the principles of good versus bad faith discussions. You should also try to avoid [logical fallacies](https://yourlogicalfallacyis.com/) as much as you can, as they are a key way to devolving conversations. But, above all else, **try to remain civil, open-minded, respectful, non-toxic,** and debate with good faith and good will towards even the most ideologically opposite debate opponents.",
                  inline: true
                }
              )
            .setFooter({
            text: "Remember to open a ticket if you have any questions! Don't argue about the rules in public chats. It distracts from ongoing conversations and discussions.",
            });

            interaction.reply({
                ephemeral: true,
                embeds: [infoEmbed]
            })

        } else return interaction.reply({ephemeral: true, content: "Uh oh! We couldn't figure out what embed this was... that's weird."})



    }
}