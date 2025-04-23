const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const infractionData = require("../../schemas/infractions");
const CaseCountSchema = require("../../schemas/casecount");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("incident")
    .setDescription("Log an unnotified incident against a user")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("User to log an incident")
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
        .setDescription("Reason for incident log")
        .setRequired(true)
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
    // if (!target.manageable || !target.moderatable) {
    //   errorsArray.push(
    //     "• Selected target is not moderatable by this bot. This is likely a permissions issue."
    //   );
    // }
    if (errorsArray.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
        ephemeral: true,
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
      InfractionType: "Incident",
      Date: Date.now(),
      Reason: violation + " | " + reason,
    });
    await profileData.save().catch(console.error);
    console.log("New log created and saved!");

    const incidentEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setAuthor({
        name: `${target.user.username}`,
        iconURL: `${target.user.displayAvatarURL()}`,
      })
      .setDescription(
        `**Incident issued against member:**\n🚫 ${target.user} (${target.id})`
      )
      .addFields(
        { name: "**Reason:**", value: violation + " | " + reason },
        { name: "**Case ID:**", value: caseNumVal.toString() }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const logChannel =
      interaction.guild.channels.cache.get("1052421373353525351");

    interaction.reply({ embeds: [incidentEmbed], ephemeral: true });
    logChannel.send({ embeds: [incidentEmbed] });
  },
};
