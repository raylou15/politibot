const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const messagecountData = require("../../schemas/messagecount");
const xp = require('simply-xp');

module.exports = {
  name: "messageCreate",
  async execute(message, data, role) {

    message.reply("TEMPORARY: You've levelled up! (this is only for debugging purposes please ignore)")

  }
}