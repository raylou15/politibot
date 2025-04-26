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
} = require("discord.js");
const verifyData = require("../../schemas/verificationdata");
module.exports = {
  name: "ageconfirmation",
  description: "Confirm your age.",
  /**
   *
   * @param {SelectMenuInteraction} interaction
   */
  async execute(interaction) {
    let response = interaction.values[0];
    let verifyProfile = verifyData.findOne({ UserID: interaction.user.id });
    if (response === "13-") {
      interaction.user.send("Sorry, you're below Discord's allowed ToS age!");
      interaction.member.ban();
    } else if (response === "13-15") {
      const ageEmbed = new EmbedBuilder()
        .setDescription(
          "Sorry, we can only allow 16+ people into this server! If you feel you've made a mistake, use <#999439440273473657> to contact Moderators for help."
        )
        .setColor("Red");
      await verifyData.findOneAndUpdate(
        { UserID: interaction.user.id },
        { $set: { Age: response } }
      );
      interaction.reply({ embeds: [ageEmbed], ephemeral: true });
    } else {
      //Continue to next thing!
      await verifyData.findOneAndUpdate(
        { UserID: interaction.user.id },
        { $set: { Age: response } }
      );

      var q1 = {
        question:
          "Which rule prohibits the spread of misinformation with the potential to cause harm?",
        answer: "correct",
        answerL: "Rule 11",
        answer2: "rule12",
        answer2L: "Rule 12",
        answer3: "rule4",
        answer3L: "Rule 4",
      };
      var q2 = {
        question: "Where is extremism defined under our rules?",
        answer: "correct",
        answerL: "Rule 4",
        answer2: "rule8",
        answer2L: "Rule 8",
        answer3: "rule5",
        answer3L: "Rule 5",
      };
      var q3 = {
        question:
          "Which rule prohibits antagonizing comments to provoke arguments or make fun of someone's roles?",
        answer: "rule6",
        answerL: "Rule 6",
        answer2: "correct",
        answer2L: "Rule 2",
        answer3: "rule9",
        answer3L: "Rule 9",
      };
      var q4 = {
        question: "Is '2020 Election Fraud' one of the prohibited topics?",
        answer: "correct",
        answerL: "Yes",
        answer2: "idka",
        answer2L: "Not sure",
        answer3: "noa",
        answer3L: "No",
      };
      var q5 = {
        question: "Is January 6th a prohibited topic?",
        answer: "yesb",
        answerL: "Yes",
        answer2: "idkb",
        answer2L: "Not sure",
        answer3: "correct",
        answer3L: "No",
      };
  
      var randomQ = Math.floor(Math.random() * 5) + 1;
      let qEmbed = new EmbedBuilder()
        .setTitle("Rules Check")
        .setColor("Green")
        .setFooter({
          text: "The answer to this question can be found plainly in #rules-and-info",
        });
  
      let v;
  
      if (randomQ === 1) {
        v = q1;
      } else if (randomQ === 2) {
        v = q2;
      } else if (randomQ === 3) {
        v = q3;
      } else if (randomQ === 4) {
        v = q4;
      } else if (randomQ === 5) {
        v = q5;
      }
  
      let qRow = new ActionRowBuilder();
  
      qEmbed.setDescription(v.question);
      qRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`${v.answer}`)
          .setLabel(`${v.answerL}`)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`${v.answer2}`)
          .setLabel(`${v.answer2L}`)
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`${v.answer3}`)
          .setLabel(`${v.answer3L}`)
          .setStyle(ButtonStyle.Primary)
      );
  
      interaction.update({
        embeds: [qEmbed],
        components: [qRow],
        ephemeral: true,
      });
    }
  },
};
