const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(message, data, role) {

    if (!message.author.bot) {
        console.log("TEMPORARY DEBUG: You have leveled up!")
        xp.lvlRole(message, message.author.id, message.guild.id)
    }

  }
}