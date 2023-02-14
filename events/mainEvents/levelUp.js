const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(client, message, data, role) {

    const user = role.guilds.cache.get(message.guildID).members.cache.get(message.userID).user
    console.log(user)


  }
}