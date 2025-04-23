const { loadCommands, loadComponents } = require("../../handlers/handler");
const { ActivityType } = require("discord.js");
const schedule = require("node-schedule");
const MorningNews = require("../../handlers/newsletterhandler");
const EveningNews = require("../../handlers/newsletterhandler");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    // client.user.setAvatar('https://i.imgur.com/qPhLAzg.png');
    client.user.setPresence({
      activities: [{ name: "politics | /help", type: ActivityType.Playing }],
    });
    console.log("The bot is now online!");
    loadCommands(client);
    loadComponents(client);
    const guild = client.guilds.cache.get("760275642150420520");
    guild.channels.fetch();
    guild.members.fetch();
    guild.channels.cache.get("895052490574270484").send(`The bot is online and ready to go!!!!`)
  },
};
