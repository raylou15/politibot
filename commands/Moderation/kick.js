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
    .setName("kick")
    .setDescription("Kick a user for misbehavior")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
        .setMaxLength(1000)
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
    if (member.roles.highest.position <= target.roles.highest.position) {
      errorsArray.push("• Selected target has a higher level role than you!");
    }
    if (errorsArray.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
        ephemeral: true,
      });
    } else {
      target.kick().catch((err) => {
        interaction.reply({
          embeds: [
            errorsEmbed.setDescription(
              "• Could not kick this user due an uncommon error."
            ),
          ],
        });
        return console.log("Error occurred in kick.js", err);
      });
    }
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
      InfractionType: "Kick",
      Date: Date.now(),
      Reason: violation + " | " + reason,
    });
    await profileData.save().catch(console.error);
    console.log("New log created and saved!");

    const kickEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: `${target.user.username}`,
        iconURL: `${target.user.displayAvatarURL()}`,
      })
      .setDescription(`**Member kicked:**\n🥾 ${target.user} (${target.id})`)
      .addFields(
        { name: "**Reason:**", value: violation + " | " + reason },
        { name: "**Case ID:**", value: caseNumVal.toString() }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const rejoinInvite = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://discord.gg/zSDNPVm6")
        .setStyle(ButtonStyle.Link)
        .setLabel("Rejoin the Server")
    );

    const kickDMEmbed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTitle(`A moderator has kicked you:`)
      .addFields({ name: "**Reason:**", value: violation + " | " + reason })
      .setFooter({
        text: "Please rejoin the server and use /openticket to appeal.",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const logChannel =
      interaction.guild.channels.cache.get("1052421373353525351");

    interaction.reply({ embeds: [kickEmbed] });
    logChannel.send({ embeds: [kickEmbed] });
    target.user
    .send({ embeds: [kickDMEmbed], components: [rejoinInvite] })
    .catch(async (err) => {
      console.log(err);
      logChannel.send({
        content:
          "I couldn't DM this user since they do not accept DMs from server bots/members.",
      });
    });

    const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");
    pubLogChannel.send({ embeds: [kickEmbed]});

  },
};
