const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(client, message, data, role) {

    console.log(message)

    const user = client.guilds.cache.get(message.guildID).members.cache.get(message.userID).user
    
    console.log(user)

    if (user.bot) {
      return 
    } else {
      console.log("TEMPORARY DEBUG: You have leveled up!")
      const roles = xp.roleSetup.fetch(client, message.guild.id)
      console.log(roles)
    }

  }
}