const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
  ComponentType,
  Embed,
  MessageFlags
} = require("discord.js");
  const client = module.exports = {
    name: "dismissstory",
    description: "Post a news story.",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

      interaction.reply({ content: "News Story Dismissed!", flags: [MessageFlags.Ephemeral] })
      interaction.message.delete()

    },
  };
  
