const { loadCommands, loadComponents } = require("../../handlers/handler");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setAvatar("https://i.imgur.com/UcvQvmT.png");
    client.user.setPresence({
      activities: [{ name: "you.", type: ActivityType.Watching }],
    });
    console.log("The Client is now online!");
    loadCommands(client);
    loadComponents(client);
    const guild = client.guilds.cache.get("760275642150420520");
    guild.members.fetch();
  },
};
