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
      console.log(currentLvl)
      const chooseroles = [];

      roles.forEach(element => {
        if (element.lvl === currentLvl) {
          console.log(`MATCH: ${currentLvl} : ${element.lvl} - ${element.role}`)
          roles.forEach(role => {
            if (element.lvl === currentLvl) {
              console.log("adding new role")
              member.roles.add(element.role)
            } else if (member.roles.cache.find(r => r.id === element.role)) {
              console.log("removing a role")
              member.roles.remove(element.role)
            }
          })
        }
      });

      console.log("Roles updated for user on level up.")

    }

  }
}