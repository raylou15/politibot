const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "levelUp",
  async execute(client, message, data, role) {

    console.log('message')
    console.log(message)
    console.log('data')
    console.log(data)
    console.log('role')
    console.log(role)
    console.log('ok')

  }
}