const config = require("../config.json");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");

  function bumpReminder(client) {
    client.guilds.cache.get('760275642150420520').channels.cache.get('886728064086708234').send(`<@886727925674676264> A new window has opened! Bump on discord.me -> https://discord.me/dashboard`)
  }

  module.exports = {
    bumpReminder: bumpReminder
  }