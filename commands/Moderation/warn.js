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
    .setName("warn")
    .setDescription("Warn a user for misbehavior")
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
        .setName("reason")
        .setDescription("Provide a reason!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild, member } = interaction;
    const target = options.getMember("target");
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
    if (member.roles.highest.position < target.roles.highest.position) {
      errorsArray.push("• Selected target has a higher level role than you!");
    }
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
      InfractionType: "Warn",
      Date: Date.now(),
      Reason: reason,
    });
    await profileData.save().catch(console.error);
    console.log("New log created and saved!");

    const warnEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setAuthor({
        name: `${target.user.tag}`,
        iconURL: `${target.user.displayAvatarURL()}`,
      })
      .setDescription(
        `**Member issued warning:**\n⚠️ ${target.user} (${target.id})`
      )
      .addFields(
        { name: "**Reason:**", value: reason },
        { name: "**Case ID:**", value: caseNumVal.toString() }
      )
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const warnDMEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTitle(`A moderator has warned you:`)
      .addFields({ name: "**Reason:**", value: reason })
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

    interaction.reply({ embeds: [warnEmbed] });
    logChannel.send({ embeds: [warnEmbed] });
    target.user.send({ embeds: [warnDMEmbed], components: [] }).catch(async (err) => {
      console.log(err);
      logChannel.send({
        content:
          "I couldn't DM this user since they do not accept DMs from server bots/members.",
      });
    });
  },
};
