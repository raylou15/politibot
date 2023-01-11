const { EmbedBuilder, ChannelType, AttachmentBuilder } = require("discord.js");
const { execute } = require("./ready");
const xp = require('simply-xp');

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.guild) {
      user = message.author;
    member = message.guild.members.cache.get(message.author.id);

    //News
    if (message.channel.type === ChannelType.GuildAnnouncement ) {
      message.crosspost()
        .catch(console.error);
    }

    if (message.author.bot) {
      return;
    }

    // New XP System:
    xp.addXP(message, message.author.id, message.guild.id, 10)

    //Trusted Member Status

    const status = Date.now();
    const joined = await member.joinedTimestamp;
    const datetime = status - joined;
    const userXP = xp.fetch(message.author.id, message.guild.id);

    if (
      member.roles.cache.has("909989200378601472") &&
      await userXP.level >= 6 &&
      datetime >= 1209600000
    ) {
      member.roles.add("775838439538425866").then(member.roles.remove("909989200378601472")).then(message.channel.send(
        `${member.user}, congratulations! You have become a trusted member. You now have access to important permissions and channels.`
      ))
    }

    //Filtered messages

    // if (message.author.id === "268362876346040320") {
    //   message.channel.send(
    //     "Gott spoke, but he doesn't believe Ray can code a bot. So, his first amendment rights have been abolished."
    //   );
    //   message.member.timeout(5 * 1000);
    //   message.delete();
    // }

    if (message.content.toLowerCase().includes("socialism is when")) {
      message.reply("https://www.youtube.com/watch?v=rgiC8YfytDw");
    }

    if (message.content.toLowerCase().includes("sounds like commie") || message.content.toLowerCase().includes("sounds like some commie") || message.content.toLowerCase().includes("commie")) {
      message.reply({files: ["./otherfiles/commie.mp4"]})
    }
    if (
      message.content.toLowerCase().includes("lets go brandon") ||
      message.content.toLowerCase().includes("let's go brandon") ||
      message.content.toLowerCase().includes("lets go, brandon") ||
      message.content.toLowerCase().includes("let's go, brandon") ||
      message.content.toLowerCase().includes("les go brandon") ||
      message.content.toLowerCase().includes("less go brandon") ||
      message.content.toLowerCase().includes("let’s go brandon") ||
      message.content.toLowerCase().includes("let’s go, brandon")
    ) {
      message.reply(":clown:");
    }

    // Genocide
    if (message.content.toLowerCase().includes("genocide") ||
    message.content.toLowerCase().includes("holodomor") ||
    message.content.toLowerCase().includes("holodomr")    
    ) {
      const genocideEmbed = new EmbedBuilder()
      .setColor("White")
      .setDescription(
        `Hey! We have frequent issues with discussions about genocides in this server, especially and particularly relating to classifying certain genocides as genocides. Please keep in mind that if you violate our rules in regards to genocide denial, it *will* carry a harsher punishment. We're not going to argue over it with you, either. **Our best recommendation is to drop the subject and move on.**`
      );
    message.author.send({ embeds: [genocideEmbed] }).catch((err) => {
      message.reply({ embeds: [genocideEmbed] });
    });
    }

    }
  },
};
