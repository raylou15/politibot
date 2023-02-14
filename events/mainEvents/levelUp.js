const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(client, message, data, role) {

    const member = role.guilds.cache.get(message.guildID).members.cache.get(message.userID)

    if (!member.user.bot) {
      const roles = await xp.roleSetup.fetch(client, message.guildID)
      const currentLvl = message.level
      const chooseroles = [];
      roles.forEach(element => {
        console.log(element)
      });

      console.log("Roles updated for user on level up.")

    }

  }
}