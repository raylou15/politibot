const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
const fetch = require("node-fetch")
const Parser = require("rss-parser")
const parser = new Parser();
const config = require("../../config.json");

const client = (module.exports = {
    data: new SlashCommandBuilder()
      .setName("newsupdate")
      .setDescription("Check out the latest news!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
      
        const NYTURL = `https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml`;

        let NYTfeed = await parser.parseURL(NYTURL);

        const story = NYTfeed.items[0]
        const isoString = story.isoDate
        const date = new Date(isoString)

        const newsEmbed = new EmbedBuilder()
        .setTitle(`${story.title}`)
        .setColor("White")
        .setURL(`${story.link}`)
        .setDescription(`${story.content}`)
        .setFooter({ text: "The New York Times", iconURL: `https://theme.zdassets.com/theme_assets/968999/d8a347b41db1ddee634e2d67d08798c102ef09ac.jpg`})
        .setTimestamp(date.getTime());

        interaction.reply({ embeds: [newsEmbed] })

    },
});
  