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
  const infractionData = require("../../schemas/infractions");
  const CaseCountSchema = require("../../schemas/casecount");
  const ms = require("ms");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("voicemute")
      .setDescription("Mutes a user in voice channels.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setDMPermission(false)
      .addUserOption((options) =>
        options
          .setName("target")
          .setDescription("Targeted user")
          .setRequired(true)
      )
      .addStringOption((options) =>
        options
        .setName("violation")
        .setDescription("What rule(s) did they violate? You can type your own or choose from the menu")
        .setAutocomplete(true)  
        .setRequired(true)
      )
      .addStringOption((options) =>
        options
          .setName("reason")
          .setDescription("Provide a reason!")
          .setRequired(true)
          .setMaxLength(950)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async autocomplete(interaction) {
      const focusedOption = interaction.options.getFocused(true);
      let choices;
  
      if (focusedOption.name === "violation") {
        choices = ['Trolling', 'Misusing Channels', 'No Tolerance Policy', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'Discussing Moderation Actions', 'Link Spam', 'English Only'];
      }
  
      const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    },
    async execute(interaction, client) {
      const { options, guild, member } = interaction;
      const target = options.getMember("target");
      const violation = options.getString("violation");
      const reason = options.getString("reason");
      // const rulestestvalue = options.getBoolean("rulestest");
  
      //This collects all errors in an interaction to relay back to the user at the same time.
      const errorsArray = [];
      const errorsEmbed = new EmbedBuilder()
        .setAuthor({ name: "Could not use this interaction because:" })
        .setColor("Red");
      if (!target)
        return interaction.reply({
          embeds: [
            errorsEmbed.setDescription("• Member has likely left the server."),
          ],
          ephemeral: true,
        });
      if (!target.manageable || !target.moderatable) {
        errorsArray.push(
          "• Selected target is not moderatable by this bot. This is likely a permissions issue."
        );
      }
      if (errorsArray.length) {
        return interaction.reply({
          embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
          ephemeral: true,
        });
      } else {
        target.voice.setMute(true, reason).catch((err) => {
          interaction.reply({
            embeds: [
              errorsEmbed.setDescription(
                "• Could not voice mute this user due an uncommon error."
              ),
            ],
          });
          return console.log("Error occurred in voicemute.js", err);
        });
  
        //MongoDB: Handling the data behind the scenes!
        //This updates the Case Counter.
        const numValuedoc = await CaseCountSchema.find({
          _id: "637acf789ff4d033474c8454",
        });
        const numValue = numValuedoc[0].CaseCount;
        console.log("Case Count: " + numValue);
        const caseNumVal = numValue + 1;
        console.log("Case Number Assigned: " + caseNumVal);
        await CaseCountSchema.findOneAndUpdate({
          _id: "637acf789ff4d033474c8454",
          CaseCount: numValue + 1,
        });
  
        //Let's put together what we send into the Log.
        let profileData = new infractionData({
          CaseID: caseNumVal,
          TargetID: target.id,
          IssuerID: interaction.user.id,
          InfractionType: "Voice Mute",
          Date: Date.now(),
          Reason: violation + " | " + reason,
        });
        await profileData.save().catch(console.error);
        console.log("New log created and saved!");
  
        const timeoutEmbed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${target.user.username}`,
            iconURL: `${target.user.displayAvatarURL()}`,
          })
          .setDescription(
            `**Member voice muted:**\n🔇 ${target.user} (${target.id})`
          )
          .addFields(
            { name: "**Reason:**", value: violation + " | " + reason },
            { name: "**Case ID:**", value: caseNumVal.toString() }
          )
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          });
  
        const timeoutDMEmbed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL(),
          })
          .setTitle(`A moderator has voice muted you.`)
          .addFields({ name: "**Reason:**", value: violation + " | " + reason })
          .setFooter({
            text: "Please use /openticket if you would like to appeal this decision.",
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
  
          const appealRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Appeal Server")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.gg/zSDNPVm6")
          );
  
        const logChannel =
          interaction.guild.channels.cache.get("1052421373353525351");
  
        interaction.reply({ embeds: [timeoutEmbed] });
        logChannel.send({ embeds: [timeoutEmbed] });
        target.user.send({ embeds: [timeoutDMEmbed], components: [] }).catch(async (err) => {
          console.log(err);
          logChannel.send({
            content:
              "I couldn't DM this user since they do not accept DMs from server bots/members.",
          });
        });

        const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");
        pubLogChannel.send({ embeds: [timeoutEmbed]});

      }
    },
  };
  