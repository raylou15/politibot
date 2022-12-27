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
    name: "poststory",
    description: "Post a news story.",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        const newsChannel = interaction.guild.channels.cache.get('775837560651120640')

        newsChannel.send({ embeds: [interaction.message.embeds[0]] })

        interaction.reply("News Story Submitted!")

    },
  };
  
