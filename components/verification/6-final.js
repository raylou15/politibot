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
} = require("discord.js");
const verifyData = require("../../schemas/verificationdata");
module.exports = {
  name: "confirm",
  description: "all done :)",
  /**
   *
   * @param {SelectMenuInteraction} interaction
   */
  async execute(interaction) {
    const verifyProfile = await verifyData.findOne({
      UserID: interaction.user.id,
    });
    const chosenUni = verifyProfile.StudentHub;

    const gsurole = interaction.guild.roles.cache.get("940461713722060840");
    const msurole = interaction.guild.roles.cache.get("940427642602160169");
    const lhurole = interaction.guild.roles.cache.get("940427588592078950");
    const fhurole = interaction.guild.roles.cache.get("940427554022629446");
    const neurole = interaction.guild.roles.cache.get("940427516882092052");
    const psurole = interaction.guild.roles.cache.get("951200073109373058");
    const uscrole = interaction.guild.roles.cache.get("962059336551653437");
    const lfcrole = interaction.guild.roles.cache.get("940448854426402826");

    var uniRole;
    if (chosenUni === "gsu") {
      uniRole = interaction.member.roles.add(gsurole);
    } else if (chosenUni === "msu") {
      uniRole = interaction.member.roles.add(msurole);
    } else if (chosenUni === "lhu") {
      uniRole = interaction.member.roles.add(lhurole);
    } else if (chosenUni === "fhu") {
      uniRole = interaction.member.roles.add(fhurole);
    } else if (chosenUni === "neu") {
      uniRole = interaction.member.roles.add(neurole);
    } else if (chosenUni === "psu") {
      uniRole = interaction.member.roles.add(psurole);
    } else if (chosenUni === "usc") {
      uniRole = interaction.member.roles.add(uscrole);
    } else if (chosenUni === "lfc") {
      uniRole = interaction.member.roles.add(lfcrole);
    }

    await interaction.member.roles.remove("909988798308433920");
    console.log("Removed Unverified Role")
    await interaction.member.roles.add("909989200378601472");
    console.log("Added Verified Role")

    const logEmbed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({
        name: interaction.user.username + ` ${interaction.user.id}`,
        iconURL: interaction.user.avatarURL(),
      })
      .addFields(
        {
          name: "Attempt Number:",
          value: "`" + `${verifyProfile.attemptNum.toString()}` + "`",
        },
        { name: "Age:", value: "`" + `${verifyProfile.Age}` + "`" },
        {
          name: "Student Hub:",
          value: "`" + `${verifyProfile.StudentHub}` + "`",
        }
      );

    const logChannel =
      interaction.guild.channels.cache.get("984871497640321025");

    const doneEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription("Done");

    interaction.update({ embeds: [doneEmbed], components: [] });
    logChannel.send({ embeds: [logEmbed] });
  },
};
