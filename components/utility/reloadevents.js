const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const { loadCommands, loadComponents } = require("../../handlers/handler");
const { loadEvents } = require("../../handlers/handler");
const client = module.exports = {
    name: "reloadevents",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

      for (const [key, value] of client.events)
      client.removeListener(`${key}`, value, true);
      loadEvents(client);
      interaction.reply({ content: "🔄 Reloaded Events", ephemeral: true });
        
    },
  };
  
