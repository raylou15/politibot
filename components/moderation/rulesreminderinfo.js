const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
  ComponentType,
  Embed,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder
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

    const container = interaction.message.components[0]

    if (!container) return interaction.reply({
      components: [
        new ContainerBuilder()
          .setAccentColor([255, 0, 0])
          .addSectionComponents(new SectionBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent("Uh oh! We couldn't figure out what embed this was... that's weird. Please report this.")
              .setButtonAccessory(new ButtomBuilder()
                .setCustomId("openaticket")
                .setLabel("Open a Ticket")
                .setEmoji('📩')
                .setDisabled(false)
                .setStyle(ButtonStyle.Primary),
              ))
          )
      ],
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
    })

    if (container.components[0].content.includes("Rule 1 Reminder")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 1 violation?",
                "Some common examples of Rule 1 Violations include being insulting towards other users, insulting them for a political viewpoint that they hold, or being generally aggressive/hostile in a debate or casual discussion.",
                "### ✅  How can I avoid violating this rule?",
                "It's pretty simple — just be respectful! No matter how much you may disagree with a person, treat them with the same respect and dignity you would expect out of anyone else. At the end of the day, we're all people. Be nice!",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 2")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 2 violation?",
                "Some common examples of Rule 2 Violations include saying intentionally inflammatory/derogatory statements that are charged in a way to start a fight with a particular ideological viewpoint, poking fun at people's opinions, lifestyles, etc in order to start a fight, or other similar examples.",
                "### ✅  How can I avoid violating this rule?",
                "Ultimately, be respectful. Let conversations about political topics arise naturally in some way or another, and if someone doesn't want to engage in what you're trying to talk about, don't prod and poke at them in order to get something out of them for the purpose of argument.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 3")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 3 violation?",
                "Simply put, Rule 3 covers harassment of any form. Sexual, verbal, emotional, physical, or otherwise that may happen within our server, outside of our server, or stemming from our server (such as real life). Targeting or harassing someone for their political views, opinions, or otherwise is strictly prohibited.",
                "### ✅  How can I avoid violating this rule?",
                "Avoid harassing people over their views, opinions, or lifestyles. If you engage with this user outside of the community, do not harass them over anything *because of* the community, i.e. learning about their views, opinions, or lifestyles. And, if you are a member of our Student Hubs, don't stalk, harass, assault, or otherwise to other members of our community.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 4")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 4 violation?",
                "Rule 4 violations can include a breadth of violations, such as: \n\n • supporting or glorifying violent extremist organizations (i.e. ANTIFA, Proud Boys, Hamas, etc) or violent extremist actors or actions (such as extremist leaders or terrorists); \n • suggesting the exclusion of a group from political participation or society (such as saying liberals shouldn't be allowed to vote); \n • advocating for the violent overthrow of government; \n • or other posts similar to these criteria which may be deemed 'Political Extremism' in an American context.",
                "### ✅  How can I avoid violating this rule?",
                "Keep your most extreme ideological views out of our server if they are incompatible with this rule. Generally speaking, if you're advocating for any of these things, you've probably already lost the discussion. Focus on making meaningful arguments about our society and our system that can be solved in realistic and pragmatic ways, even if you're speaking from the viewpoint of a Communist, Fascist, or otherwise.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })
                
    } else if (container.components[0].content.includes("Rule 5")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 5 violation?",
                "Generally speaking, being prejudicial or obstinate towards a person or group of people regarding their political views, political affiliations, lifestyles, or otherwise.",
                "### ✅  How can I avoid violating this rule?",
                "Don't senselessly hate on people for being different and not seeing things the same way you do. We're all people at the end of the day, and *all* of our voices matter.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 6")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 6 violation?",
                "Racist or Sexist comments, racial slurs (of any kind and to any degree), or other offensive content that discriminates or prejudices against people based on their protected characteristics, [as defined by Discord in their Community Guidelines.](https://discord.com/guidelines#:~:text=We%20consider%20the,weight%20and%20size.) Not all of those fall under Rule 6, but the majority do if they are unchangeable factors of their personhood.",
                "### ✅  How can I avoid violating this rule?",
                "Simply be nice to people. You don't need to use slurs, and you should generally treat people as equals regardless of their physical or genetic makeups. Don't be discriminatory or predjudicial, basically.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 7")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 7 violation?",
                "Shitposting in the middle of a serious conversation, spamming memes or images in inappropriate channels, discussing politics in <#760275642150420523> or off topic discussion in a political channel, posting NSFW, etc.",
                "### ✅  How can I avoid violating this rule?",
                "Don't do any of the stuff listed to the left. Channels have purposes in their title and description - pay attention to them.",
                "### ❌  Why no NSFW??? Why can't I post memes wherever I want? Where is the memes channel?",
                "As a public server on Server Discovery, we cannot have NSFW content of any kind. Memes and picture spam can be annoying, so we try to keep it all in <#775867278016118794>, which is our dedicated meme channel. We don't have a #meme channel because in the past a channel with that title attracted a lot of degenerates who we ended up having to immediately ban.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 8")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 8 violation?",
                "All of Discord’s Community Guidelines and Safety Policies must be followed. This also implies that unsolicited advertisements, messages, spam, or other content delivered to members within this server or through DMs is strictly prohibited.",
                "### ✅  How can I avoid violating this rule?",
                "Follow Discord's Community Guidelines, and do not send unsolicited content or spam to server members either within the server or through direct messages.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })


    } else if (container.components[0].content.includes("Rule 9")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 9 violation?",
                "Any content in any part of a user’s profile that violates our rules or Discord’s Community Guidelines is prohibited.",
                "### ✅  How can I avoid violating this rule?",
                "Ensure that your username, bio, status, profile pictures, banners, and any other visible profile content fully complies with our rules and with Discord’s Community Guidelines.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 10 Reminder")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 10 violation?",
                "Content that is intentionally and explicitly malicious and intended to harass, demean, invalidate, or cause harm to people because of their beliefs, personhoods, or otherwise for personal or political reasons is prohibited.",
                "### ✅  How can I avoid violating this rule?",
                "Always assume the best in others and avoid posting content designed to hurt, belittle, or attack people for their identity, political beliefs, or personal choices. Do not post comments that are personal attacks, mockery, harassment, or attempts to invalidate someone’s basic dignity as a person.",
                "",
                "**Acceptable behavior:** disagreeing respectfully with someone's viewpoint, critiquing ideas without targeting the individual, calmly debating without making it personal.",
                "",
                "**Prohibited behavior:** calling people derogatory names based on their beliefs, mocking someone's identity, wishing harm upon groups or individuals, or trying to invalidate people's existence for political or personal reasons.",
                "",
                "If your intent behind posting something is to demean, bully, or harm others, it violates this rule, even if it’s framed as a 'joke' or 'debate'.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 11 Reminder")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 11 violation?",
                "Any conduct with intent to convey false or misleading information, claims, rumors, or conspiracy theories is prohibited. This includes promoting political agendas with no factual standing, harmful or dangerous information or behavior, or spreading false or misleading claims about civic processes or that would otherwise undermine civic integrity or suppress civic participation. All content related to public issues, particularly civic or health events, must be factual and based on credible sources to ensure a safe, trustworthy community.",
                "### ✅  How can I avoid violating this rule?",
                "Before you post about public issues, health topics, or civic events, take the time to fact-check your information. Only share credible, verifiable sources — preferably from reputable organizations, government agencies, or well-established media. Avoid promoting rumors, half-truths, or conspiracies that could mislead other users or cause harm.",
                "",
                "**Acceptable behavior:** discussing topics using credible news sources, academic papers, or government data; admitting when you’re unsure and asking for clarification.",
                "",
                "**Prohibited behavior:** spreading claims like widespread election fraud without evidence, sharing conspiracy theories about vaccines or world events, linking to untrustworthy, fringe, or fake news sites, or using 'just asking questions' as a cover for promoting disinformation.",
                "",
                "When in doubt, double-check. If you can't verify it through a trusted source, don’t share it. We aren't here to be the arbiters of truth, so just make sure you have good sources, and the rest is up for debate!",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 12 Reminder")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 12 violation?",
                "The following topics often devolve into malicious content, misinformation, conspiracy theories, or general incivility, and will be heavily moderated with higher degrees of punishment if violations occur:",
                "• LGBTQ+ Issues",
                "• Political Riots/Civic Unrest",
                "• Global Wars or Conflicts",
                "",
                "The following topics are strictly prohibited:",
                "• 2016/2020 Election Fraud",
                "• COVID-19/Health Conspiracies",
                "• Genocide Denial",
                "• Race Realism or Related Topics",
                "",
                "### ✅  How can I avoid violating this rule?",
                "Approach sensitive topics with extreme caution, or avoid them entirely if you are unsure whether you can discuss them civilly. Never promote prohibited topics such as election fraud conspiracies, COVID-19 misinformation, genocide denial, or race realism. These subjects will result in fast and severe moderation action.",
                "",
                "**Acceptable behavior:** carefully discussing civic unrest or wars with reputable sources, staying fact-focused, being respectful of different experiences and perspectives.",
                "",
                "**Prohibited behavior:** claiming elections were 'rigged' without evidence, promoting anti-vaccine conspiracy theories, denying genocide events, promoting racist pseudoscience, or turning a discussion hostile with inflammatory rhetoric.",
                "",
                "If the topic is known to trigger incivility, assume it is better to avoid or tread very lightly.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else if (container.components[0].content.includes("Rule 13 Reminder")) {

      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 255, 255])
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(
              [
                "### ❔ What even is a Rule 13 violation?",
                "Displaying bad faith behavior includes, but is not limited to, toxicity, intent to dominate or coerce the opposition into compliance or acquiescence, disrespect, intentional dishonesty, abusing debate with logical fallacies, or otherwise not approaching debates with an open mind, good will and respect, and displaying good and true intentions in a good faith manner.",
                "### ✅  How can I avoid violating this rule?",
                "Debate with the genuine intention of understanding and discussing ideas, not 'winning' or humiliating others. Avoid tactics like logical fallacies, strawmanning, personal attacks, or intentionally dishonest arguments. Always engage with others respectfully, assume good intent until proven otherwise, and argue in a way that you would want to be argued with.",
                "",
                "**Acceptable behavior:** stating your beliefs calmly, acknowledging when others have good points, respectfully disagreeing while maintaining civility.",
                "",
                "**Prohibited behavior:** goalpost moving, ignoring counterpoints dishonestly, derailing debates, mocking opponents, refusing to acknowledge valid arguments, or intentionally using debate tactics in bad faith.",
                "",
                "If you're debating to dominate or to humiliate, not to understand and reason, you are violating this rule.",
              ].join("\n")
            ))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
            .addSectionComponents(
              new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`*Still have questions about why you were warned or how this rule applies? Please open a ticket and ask questions!*`))
                .setButtonAccessory(
                  new ButtonBuilder()
                    .setCustomId("openaticket")
                    .setLabel("Open a Ticket")
                    .setEmoji('📩')
                    .setDisabled(false)
                    .setStyle(ButtonStyle.Primary),
                )
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })

    } else {
      return interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor([255, 0, 0])
            .addSectionComponents(new SectionBuilder()
              .addTextDisplayComponents(new TextDisplayBuilder().setContent("Uh oh! We couldn't figure out what embed this was... that's weird. Please report this.")
                .setButtonAccessory(new ButtomBuilder()
                  .setCustomId("openaticket")
                  .setLabel("Open a Ticket")
                  .setEmoji('📩')
                  .setDisabled(false)
                  .setStyle(ButtonStyle.Primary),
                ))
            )
        ],
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
      })
    }

  }
}