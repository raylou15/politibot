const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  MessageFlags
} = require("discord.js");
const verifyData = require("../../schemas/verificationdata");

module.exports = {
  name: "verifybutton",
  description: "Start the verification process.",
  async execute(interaction) {
    const cancelEmbed = new EmbedBuilder()
      .setDescription(
        "Whoops! It looks like you have reached your maximum three attempts. Please use <#999439440273473657> to contact Moderators for help."
      )
      .setColor("Red");
    const ageEmbed = new EmbedBuilder()
      .setDescription(
        "Sorry, we can only allow 16+ people into this server! If you feel you've made a mistake, use <#999439440273473657> to contact Moderators for help."
      )
      .setColor("Red");

    let verifyProfile;
    verifyProfile = await verifyData.find({
      UserID: await interaction.user.id,
    });
    if (verifyProfile[0] === undefined || !verifyProfile) {
      verifyProfile = new verifyData({
        UserID: interaction.user.id,
        attemptNum: 0,
        Age: 0,
        StudentHub: "None Selected",
        QuestionProvided: 0,
        QuestionAnswerCorrect: false,
        AgreePolicy: false,
      });
      await verifyProfile.save().catch(console.error);
    }

    verifyProfile = await verifyData.find({
      UserID: await interaction.user.id,
    });

    if (verifyProfile[0].attemptNum < 3) {
      if (
        verifyProfile[0].Age === "0" ||
        verifyProfile[0].Age === "16-20" ||
        verifyProfile[0].Age === "21-24" ||
        verifyProfile[0].Age === "25-29" ||
        verifyProfile[0].Age === "30-39" ||
        verifyProfile[0].Age === "40-49" ||
        verifyProfile[0].Age === "50+"
      ) {
        //Continue!
        await verifyData.findOneAndUpdate(
          { UserID: interaction.user.id },
          { $set: { attemptNum: verifyProfile[0].attemptNum + 1 } }
        );
        verifyProfile[0].attemptNum = verifyProfile[0].attemptNum + 1;

        const initEmbed = new EmbedBuilder()
          .setDescription("Please confirm your age.")
          .setColor("Green")
          .setFooter({
            text: "We do not store this information publicly.",
          });

        const selectRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("ageconfirmation")
            .setPlaceholder("Please select an option")
            .addOptions(
              {
                label: "Under 13",
                value: "13-",
              },
              {
                label: "13-15",
                value: "13-15",
              },
              {
                label: "16-20",
                value: "16-20",
              },
              {
                label: "21-24",
                value: "21-24",
              },
              {
                label: "25-29",
                value: "25-29",
              },
              {
                label: "30-39",
                value: "30-39",
              },
              {
                label: "40-49",
                value: "40-49",
              },
              {
                label: "50+",
                value: "50+",
              }
            )
        );
        return interaction.reply({
          embeds: [initEmbed],
          components: [selectRow],
          flags: [MessageFlags.Ephemeral],
        });
      } else {
        //Uh oh! Underage!
        return interaction.reply({ embeds: [ageEmbed], flags: [MessageFlags.Ephemeral] });
      }
    } else {
      //Too many attempts!
      return interaction.reply({ embeds: [cancelEmbed], flags: [MessageFlags.Ephemeral] });
    }
  },
};
