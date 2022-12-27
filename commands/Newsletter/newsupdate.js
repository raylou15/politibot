const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
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
      
        const mainURL = `https://api.newscatcherapi.com/v2/latest_headlines?page_size=25&when=24h&countries=US&topic=politics&lang=en&sources=cnn.com,nytimes.com,foxnews.com,nbcnews.com,politico.com,npr.org,apnews.com,reuters.com,thehill.com,usatoday.com,washingtonpost.com,cbsnews.com`;
        const mainHeader = {
          "X-API-Key": config.newscatcherAPI,
        }

        fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
          return res.json()
        }).then((json) => {

          let nytimes = [];
          let cnn = [];
          let thehill = [];
          let foxnews = [];
          let nbcnews = [];
          let politico = [];
          let npr = [];
          let apnews = [];
          let reuters = [];
          let washingtonpost = [];
          let cbsnews = [];
          let usatoday = [];

          const sendChannel = interaction.guild.channels.cache.get("775494762216161341")

          const postButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('poststory')
              .setLabel('Post')
              .setStyle(ButtonStyle.Success),
           )

          json.articles.forEach((element) => {
            if (element.is_opinion === false) {
              if (element.clean_url === 'nytimes.com') {
                nytimes.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("White").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "The New York Times • Data Provided By NewsCatcherAPI", iconURL: `https://theme.zdassets.com/theme_assets/968999/d8a347b41db1ddee634e2d67d08798c102ef09ac.jpg`}).setTimestamp() ]})
              
              } else if (element.clean_url === 'cnn.com') {
                cnn.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Red").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "CNN • Data Provided By NewsCatcherAPI", iconURL: `https://www.logodesignlove.com/wp-content/uploads/2010/06/cnn-logo-white-on-red.jpg`}).setTimestamp() ]})
             
              } else if (element.clean_url === 'thehill.com') {
                thehill.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Blue").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "The Hill • Data Provided By NewsCatcherAPI", iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/The_Hill_%282020-01-15%29.svg/938px-The_Hill_%282020-01-15%29.svg.png`}).setTimestamp() ]})
              
              } else if (element.clean_url === 'foxnews.com') {
                foxnews.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Red").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "Fox News • Data Provided By NewsCatcherAPI", iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/512px-Fox_News_Channel_logo.svg.png?20210409132504`}).setTimestamp() ]})
              
              } else if (element.clean_url === 'nbcnews.com') {
                nbcnews.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Navy").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "NBC News • Data Provided By NewsCatcherAPI", iconURL: `https://www.afsc.org/sites/default/files/styles/maxsize/public/images/NBC%20News.png?itok=QyB1uaGb`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'politico.com') {
                politico.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Red").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "POLITICO • Data Provided By NewsCatcherAPI", iconURL: `https://skdknick.com/wp-content/uploads/2020/11/politico-logo-sq.png`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'npr.org') {
                npr.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Purple").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "NPR • Data Provided By NewsCatcherAPI", iconURL: `https://turnaround.ams3.digitaloceanspaces.com/wp-content/uploads/2017/06/14033346/NPR-logo-square.png`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'apnews.com') {
                apnews.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("White").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "AP News • Data Provided By NewsCatcherAPI", iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/1200px-Associated_Press_logo_2012.svg.png`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'reuters.com') {
                reuters.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("White").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "Reuters • Data Provided By NewsCatcherAPI", iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Associated_Press_logo_2012.svg/1200px-Associated_Press_logo_2012.svg.png`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'washingtonpost.com') {
                washingtonpost.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("White").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "Washington Post • Data Provided By NewsCatcherAPI", iconURL: `https://assets.stickpng.com/thumbs/60915b7df9f20800044365bf.png`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'cbsnews.com') {
                cbsnews.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Black").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "CBS News • Data Provided By NewsCatcherAPI", iconURL: `https://www.thetascgroup.com/tasc-media/uploads/2022/04/cbs-news-square-logo.jpeg`}).setTimestamp() ]})
  
              } else if (element.clean_url === 'usatoday.com') {
                usatoday.push(element)
                sendChannel.send({ components: [postButtons], embeds: [ new EmbedBuilder().setColor("Blue").setTitle(`${element.title}`).setURL(`${element.link}`).setDescription(`${element.excerpt}`).setImage(`${element.media}`).setFooter({ text: "USA Today • Data Provided By NewsCatcherAPI", iconURL: `https://arcmi.org/wp-content/uploads/sites/15/2021/03/usa-today-logo-768x768-1.png`}).setTimestamp() ]})
  
              }
            }
          })

          interaction.reply("Done")

        })
    },
});
  