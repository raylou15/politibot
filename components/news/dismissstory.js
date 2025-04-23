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
    ComponentType,
    Embed,
  } = require("discord.js");
  const client = module.exports = {
    name: "dismissstory",
    description: "Post a news story.",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

      interaction.reply({ content: "News Story Dismissed!", ephemeral: true })
      interaction.message.delete()

    },
  };
  
