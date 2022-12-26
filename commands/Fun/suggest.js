const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest something for the server!")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("suggestion")
        .setDescription("What's your suggestion?")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    // Just grabbing the user for something later...
    const intAuth = interaction.user;

    // Setting up the button menus for the interaction...
    const submitMenu = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("submit")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    const reviewMenu = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("approve")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("reject")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
    );

    // Voting Emojis...
    const up = client.emojis.cache
      .find((emoji) => emoji.name == "upvote")
      .toString();
    const down = client.emojis.cache
      .find((emoji) => emoji.name == "downvote")
      .toString();
    const neut = client.emojis.cache
      .find((emoji) => emoji.name == "neutralvote")
      .toString();

    // Channels and stuff
    var log = interaction.guild.channels.cache.get(client.config.logChannel);
    var sendChannel =
      interaction.guild.channels.cache.get("965271666684985454");
    var rayChannel = interaction.guild.channels.cache.get("775494762216161341");
    // var staffChannel = interaction.guild.channels.cache.get('893189722887839797')

    // Getting the string from the input
    const suggestionText = interaction.options.getString("suggestion");

    // Message Embeds and stuff
    const submitEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Suggestion from " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("Green")
      .setDescription(
        suggestionText + "\n\n*Do you want to submit this suggestion?*"
      )
      .setTimestamp();

    const reviewEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Suggestion from " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("Green")
      .setDescription(
        suggestionText + "\n\n*Do you want to approve this suggestion?*"
      )
      .setTimestamp();

    const suggestEmbed = new EmbedBuilder()
      .setAuthor({
        name: "Suggestion from " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("Green")
      .setDescription(
        suggestionText +
          "\n\n*" +
          up +
          " to upvote / " +
          neut +
          " to abstain / " +
          down +
          " to downvote*"
      )
      .setFooter({ text: "Use /suggest to send your own suggestion!" })
      .setTimestamp();

    const suggestEmbedPreview = new EmbedBuilder()
      .setAuthor({
        name: "Suggestion from " + interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setColor("Green")
      .setDescription(suggestionText)
      .setTimestamp();

    // Sending a confirmation message to submit the suggestion for review
    const msgA = await interaction.reply({
      ephemeral: true,
      embeds: [submitEmbed],
      components: [submitMenu],
      fetchReply: true,
    });

    // Just a fancy filter majig
    const filter = (i) => {
      return i.user.id === interaction.user.id;
    };

    // The actual code
    msgA.awaitMessageComponent(filter).then(async (interaction) => {
      buttonClickValue = interaction.customId;

      if (buttonClickValue === "cancel") {
        await interaction.update({
          content: "*Suggestion cancelled.*",
          ephemeral: true,
          embeds: [],
          components: [],
        });
      } else if (buttonClickValue === "submit") {
        await interaction.update({
          content:
            "*Your suggestion has been submitted for review by server management! You will receive a DM shortly.*",
          ephemeral: true,
          embeds: [],
          components: [],
        });

        const confirmMsg = await rayChannel.send({
          content: "<@178689418415177729>, a new suggestion needs review!",
          embeds: [reviewEmbed],
          components: [reviewMenu],
          fetchReply: true,
        });

        confirmMsg.awaitMessageComponent(filter).then(async (interaction) => {
          buttonClickValue2 = interaction.customId;

          // If it's confirmed by the Management...
          if (buttonClickValue2 === "approve") {
            await confirmMsg.edit({
              content:
                "Suggestion has been **approved**. Check <#965271666684985454>!",
              embeds: [suggestEmbedPreview],
              components: [],
            });
            // Send message to #suggestions channel!
            sendChannel
              .send({
                embeds: [suggestEmbed],
              })
              .then(async function (message) {
                await message.react(up);
                await message.react(neut);
                await message.react(down);
                return message;
              });
            // DM the user a confirmation here!
            await intAuth.send({
              content:
                "Your suggestion has been approved and submitted to <#965271666684985454> for voting! \n\nApproved Suggestion:",
              embeds: [suggestEmbedPreview],
            });
          }

          // If it's rejected by the Management...
          if (buttonClickValue2 === "reject") {
            const reasonModal = new Modal()
              .setTitle("Rejection Reason")
              .setCustomId("reject_reason");

            const reasonInputComponent = new TextInputComponent()
              .setCustomId("reasoninput")
              .setLabel("Reason:")
              .setMinLength(2)
              .setMaxLength(1000)
              .setRequired(false)
              .setStyle("PARAGRAPH")
              .setPlaceholder("Enter a reason here");

            const row_Input = new MessageActionRow().addComponents(
              reasonInputComponent
            );

            reasonModal.addComponents(reasonInputComponent);

            await interaction.showModal(reasonModal);

            await interaction
              .awaitModalSubmit({ time: 60000 })
              .then(async (interaction) => {
                const reasonInputted =
                  await interaction.fields.getTextInputValue("reasoninput");
                if (reasonInputted === null) {
                  reasonInputted = "No reason was given.";
                }

                const reasonEmbed = {
                  color: "#ffffff",
                  author: {
                    name:
                      "Suggestion from " +
                      intAuth.username +
                      " rejected by " +
                      interaction.user.username,
                    icon_url: interaction.user.avatarURL(),
                  },
                  description:
                    "**Suggestion:** \n" +
                    suggestionText +
                    "**\n\nReason: \n**" +
                    reasonInputted,
                  timestamp: new Date(),
                };

                await interaction.reply({
                  embeds: [reasonEmbed],
                  components: [],
                });

                await confirmMsg.edit({
                  embeds: [suggestEmbedPreview],
                  components: [],
                });

                await intAuth.send({
                  content:
                    "Your suggestion has been **rejected** for the following reasons:",
                  embeds: [reasonEmbed],
                });
              });
          }
        });
      }
    });
  },
};
