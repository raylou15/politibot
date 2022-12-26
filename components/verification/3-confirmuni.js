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
  name: "confirmuni",
  description: "Confirm your school.",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.customId === "confirmuni") {
      const yesEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription("Which school do you go to?")
        .setFooter({
          text: "This will give you a role for one of our connected hubs; if you would not like one, choose 'Somewhere Else'",
        });

      const yesRow = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("schoolident")
          .setPlaceholder("Please select an option")
          .addOptions(
            {
              label: "Georgia State University",
              value: "gsu",
            },
            {
              label: "Michigan State University",
              value: "msu",
            },
            {
              label: "Lehigh University",
              value: "lhu",
            },
            {
              label: "Fordham University",
              value: "fhu",
            },
            {
              label: "Northeastern University",
              value: "neu",
            },
            {
              label: "Pennsylvania State University",
              value: "psu",
            },
            {
              label: "University of South Carolina",
              value: "usc",
            },
            {
              label: "Lafayette College",
              value: "lfc",
            },
            {
              label: "Somewhere Else",
              value: "elsewhere",
            }
          )
      );

      interaction.update({
        embeds: [yesEmbed],
        components: [yesRow],
        ephemeral: true,
      });
    }
  },
};
