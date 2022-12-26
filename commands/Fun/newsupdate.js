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
      
        const mainURL = `https://api.newscatcherapi.com/v2/search?countries=US&topic=politics&lang=en&sources=cnn.com,nytimes.com,foxnews.com,nbcnews.com,politico.com,npr.org,apnews.com,reuters.com,thehill.com,usatoday.com,washingtonpost.com,cbsnews.com`;
        const mainHeader = {
          "X-API-Key": "Cw83tzJ0P9ibqqTMhXJPXWDcKhZGoW6tKjeWer74oBc",
        }

        fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
          return res.json()
        }).then((json) => {
          if (!json.articles[0]) {
            return interaction.reply({ content: "No results were returned.", ephemeral: true })
          }

          console.log(json.articles)

        })

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
  