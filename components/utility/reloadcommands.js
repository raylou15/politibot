const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const { loadCommands, loadComponents } = require("../../handlers/handler");
const { loadEvents } = require("../../handlers/handler");
const client = module.exports = {
    name: "reloadcommands",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

      loadCommands(client);
      interaction.reply({
        content: "🔄 Reloaded Commands",
        ephemeral: true,
      });
        
    },
  };
  
