const { EmbedBuilder, ChannelType } = require("discord.js");
const { execute } = require("./ready");
const xp = require("simply-xp");
const ms = require('ms')
const config = require("../../config.json")

// OpenAI Setup
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: config.openAIAPI
});

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.guild) {
      user = message.author;
      member = message.guild.members.cache.get(message.author.id);

      // OpenAI
      if (message.channel.id === "1068370366931677234" && !message.author.bot) {
        message.channel.sendTyping()
        console.log("ai msg detected")
        const aiPrompt = message.content
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: aiPrompt,
          temperature: 0,
          max_tokens: 500,
        });
        console.log(response.data.choices)
        return message.reply(response.data.choices[0].text)
      }

      //News
      if (message.channel.type === ChannelType.GuildAnnouncement) {
        message.crosspost().catch(console.error);
      }

      if (message.author.bot) {
        return;
      }

      // New XP System:
      xp.addXP(message, message.author.id, message.guild.id, 10);

      //Trusted Member Status

      const status = Date.now();
      const joined = await member.joinedTimestamp;
      const datetime = status - joined;
      const userXP = xp.fetch(message.author.id, message.guild.id);

      if (
        member.roles.cache.has("909989200378601472") &&
        (await userXP.level) >= 6 &&
        datetime >= 1209600000
      ) {
        member.roles
          .add("775838439538425866")
          .then(member.roles.remove("909989200378601472"))
          .then(
            message.channel.send(
              `${member.user}, congratulations! You have become a trusted member. You now have access to important permissions and channels.`
            )
          );
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
      if (
        message.content.toLowerCase().includes("sounds like commie") ||
        message.content.toLowerCase().includes("sounds like some commie") ||
        message.content.toLowerCase().includes("commie")
      ) {
        message.reply(
          "https://cdn.discordapp.com/attachments/928407503690149939/1062530628257583104/commie.mp4"
        );
      }
      if (
        message.content.toLowerCase().includes("lets go brandon") ||
        message.content.toLowerCase().includes("let's go brandon") ||
        message.content.toLowerCase().includes("lets go, brandon") ||
        message.content.toLowerCase().includes("let's go, brandon") ||
        message.content.toLowerCase().includes("les go brandon") ||
        message.content.toLowerCase().includes("less go brandon") ||
        message.content.toLowerCase().includes("let???s go brandon") ||
        message.content.toLowerCase().includes("let???s go, brandon")
      ) {
        message.reply(":clown:");
      }

      if (message.author.id === "683511128961187920" && message.mentions.users.size !== 0) {
        message.reply("<@683511128961187920>")
        const target = message.author
        const targetMember = message.guild.members.cache.get(target.id)
        const duration = '15s'
        targetMember.timeout(ms(duration))
        target.send("Stop pinging people in every single message! You can communicate without it.")
      }

      // Genocide
      if (
        message.content.toLowerCase().includes("genocide") ||
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
