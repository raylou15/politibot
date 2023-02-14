const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(client, message, data, role) {

    const member = role.guilds.cache.get(message.guildID).members.cache.get(message.userID)

    if (!member.user.bot) {
      const roles = xp.roleSetup.fetch(client, message.guildID)
      const currentLvl = message.level
      const chooseroles = [];
      var bar = new Promise((resolve, reject) => {
        roles.forEach(role => {
          console.log(role)
          member.roles.remove(role.role)
          if (role.lvl <= currentLvl) {
            chooseroles.push(role)
            if (index === array.length -1) resolve();
          }
        })
      })
      bar.then(() => {
        member.roles.add(Math.max(...chooseroles.map(role => role.lvl)))
      })

      console.log("Roles updated for user on level up.")

    }

  }
}