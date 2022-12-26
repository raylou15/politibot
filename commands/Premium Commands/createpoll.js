const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
  } = require("discord.js");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("createpoll")
      .setDescription("PREMIUM - Create a custom poll for the community!")
      .setDMPermission(false)
      .addStringOption((options) =>
        options
          .setName("question")
          .setDescription("What's your question?")
          .setRequired(true)
      )
      .addStringOption((options) =>
        options
          .setName("color")
          .setDescription("Provide a color! Input a name: https://bit.ly/3Gdmed8")
          .setRequired(true)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async autocomplete(interaction, client) {
        const focusedOption = interaction.options.getFocused(true)
        let choices;
        if (focusedOption.name === 'color') {
            choices = ['Aqua', 'DarkAqua', 'Green', 'Blue', 'DarkBlue', 'Purple', 'DarkPurple', 'LuminousVividPink', 'DarkVividPink', 'Gold', 'DarkGold', 'Orange', 'DarkOrange', 'Red', 'DarkRed', 'Grey', 'DarkGrey', 'DarkerGrey', 'LightGrey', 'Navy', 'DarkNavy', 'Yellow', 'White', 'Blurple', 'Greyple', 'Black', 'DarkButNotBlack', 'NotQuiteBlack', 'Fuschsia' ]
        }

        const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
    async execute(interaction, client) {
      
      if (
        interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
        interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
        interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
        interaction.member.roles.cache.some(role => role.id === "995526730473275423") || // Ko-fi Representative
        interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
        interaction.member.roles.cache.some(role => role.id === "1055374176518680647") || // Senator
        interaction.member.roles.cache.some(role => role.id === "1055374052803493973") // Representative
        ) {

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
  
        const question = interaction.options.getString('question');
        const embedColor = interaction.options.getString('color');
        const styleChosen = interaction.options.getString('style');

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

        var rayChannel = interaction.guild.channels.cache.get("775494762216161341");
        var sendChannel = interaction.guild.channels.cache.get("760548421790203934");

        const submitEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Poll Question from " + interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            })
            .setColor(embedColor)
            .setDescription(
                question + "\n\n*Do you want to submit this poll question?*"
            )
            .setTimestamp();

        const reviewEmbed = new EmbedBuilder()
            .setAuthor({
              name: "Poll Question from " + interaction.user.username,
              iconURL: interaction.user.avatarURL(),
            })
            .setColor(embedColor)
            .setDescription(
              question + "\n\n*Do you want to approve this poll question?*"
            )
            .setTimestamp();
  
        const pollEmbed = new EmbedBuilder()
            .setAuthor({
              name: "Poll Question from " + interaction.user.username,
              iconURL: interaction.user.avatarURL(),
            })
            .setColor(embedColor)
            .setDescription(
              question +
                "\n\n*" +
                up +
                " to upvote / " +
                neut +
                " to abstain / " +
                down +
                " to downvote*"
            )
            .setFooter({ text: "Want to submit your own polls? Boost the server or check out our Premium plans!"})
            .setTimestamp();
        
        //Actual Stuff
        const suggestEmbedPreview = new EmbedBuilder()
            .setAuthor({
              name: "Poll Question from " + interaction.user.username,
              iconURL: interaction.user.avatarURL(),
            })
            .setColor(embedColor)
            .setDescription(question)
            .setTimestamp();
      
          // Sending a confirmation message to submit the suggestion for review
        const msgA = await interaction.reply({
            ephemeral: true,
            embeds: [submitEmbed],
            components: [submitMenu],
            fetchReply: true,
        });

        const filter = (i) => {
            return i.user.id === interaction.user.id;
        };

        // The actual code
        msgA.awaitMessageComponent(filter).then(async (interaction) => {
        buttonClickValue = interaction.customId;
  
        if (buttonClickValue === "cancel") {
          await interaction.update({
            content: "*Question cancelled.*",
            ephemeral: true,
            embeds: [],
            components: [],
          });
        } else if (buttonClickValue === "submit") {
          await interaction.update({
            content:
              "*Your question has been submitted for review by server management! You will receive a DM shortly.*",
            ephemeral: true,
            embeds: [],
            components: [],
          });
  
          const confirmMsg = await rayChannel.send({
            content: "<@178689418415177729>, a new poll question needs review!",
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
                  "Question has been **approved**. Check <#760548421790203934>!",
                embeds: [suggestEmbedPreview],
                components: [],
              });
              // Send message to #suggestions channel!
              sendChannel
                .send({
                    content: "<@&884971991319347230>",
                    embeds: [pollEmbed],
                })
                .then(async function (message) {
                  await message.react(up);
                  await message.react(neut);
                  await message.react(down);
                  await message.startThread({
                    name: `${question}`
                  })
                });
              // DM the user a confirmation here!
              await intAuth.send({
                content:
                  "Your question has been approved and submitted to <#760548421790203934> for voting! \n\nApproved Question:",
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
                        "Question from " +
                        intAuth.username +
                        " rejected by " +
                        interaction.user.username,
                      icon_url: interaction.user.avatarURL(),
                    },
                    description:
                      "**Question:** \n" +
                      question +
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
                      "Your Poll Question has been **rejected** for the following reasons:",
                    embeds: [reasonEmbed],
                  });
                }); 
            }
          });
        }
      });

      } else {
        return interaction.reply({ content: "You don't have the permissions for this command! This is a premium-only command. If you would like to get access to this command, and several other cool features, you need to boost the server or donate through Ko-fi or Discord! DM <@178689418415177729> for more information.", ephemeral: true})
      }
  
    },
  };
  