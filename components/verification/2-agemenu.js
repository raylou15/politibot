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
      await verifyProfile.save().catch(console.error);
      interaction.reply({ embeds: [ageEmbed], ephemeral: true });
    } else {
      //Continue to next thing!
      await verifyData.findOneAndUpdate(
        { UserID: interaction.user.id },
        { $set: { Age: response } }
      );

      const studentHubEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription("Did you find us on a Student Hub, or somewhere else?")
        .setFooter({
          text: "This will prompt to give you a role for one of our connected hubs; if you would not like one, choose 'Somewhere Else'",
        });

      const studentHubConfirmation = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirmuni")
          .setLabel("Student Hub")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("uniproceed")
          .setLabel("Somewhere Else")
          .setStyle(ButtonStyle.Secondary)
      );

      return interaction.update({
        embeds: [studentHubEmbed],
        components: [studentHubConfirmation],
        ephemeral: true,
      });
    }
  },
};
