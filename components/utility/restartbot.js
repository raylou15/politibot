const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  IntentsBitField,
  MessageFlags
} = require("discord.js");
const config = require("../../config.json")
const { loadCommands, loadComponents } = require("../../handlers/handler");
const { loadEvents } = require("../../handlers/handler");
const client = module.exports = {
    name: "restartbot",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

      interaction.reply({ content: "🔄 Restarting...", flags: [MessageFlags.Ephemeral] });

      setTimeout(function () {
        process.exit();
      }, 1000);
        
    },
  };
  
