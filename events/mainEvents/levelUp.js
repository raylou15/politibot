const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const messagecountData = require("../../schemas/messagecount");
const xp = require('simply-xp');

module.exports = {
  name: "messageCreate",
  async execute(message, data, role) {

    console.log('oh no')

  }
}