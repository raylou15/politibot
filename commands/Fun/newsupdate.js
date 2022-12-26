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
      
        const mainURL = `https://api.newscatcherapi.com/v2/latest_headlines?when=24h&countries=US&topic=politics&lang=en&sources=cnn.com,nytimes.com,foxnews.com,nbcnews.com,politico.com,npr.org,apnews.com,reuters.com,thehill.com,usatoday.com,washingtonpost.com,cbsnews.com`;
        const mainHeader = {
          "X-API-Key": "Cw83tzJ0P9ibqqTMhXJPXWDcKhZGoW6tKjeWer74oBc",
        }

        fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
          return res.json()
        }).then((json) => {
          console.log(json)

        })
    },
});
  