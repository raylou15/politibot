const config = require("../config.json");
const newsletterData = require("../schemas/newslettersubs");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");

function MorningNews(client) {
    console.log("It's time for the morning newsletter!")

    const mainURL = `https://us-congress-top-news.p.rapidapi.com/top_congressional_news.json`;
    const mainHeader = {
        "X-RapidAPI-Key": "c9b349e86amsh12b12dab086c426p1a69d8jsn212b61f856b7",
        "X-RapidAPI-Host": "us-congress-top-news.p.rapidapi.com"
    }

    fetch(mainURL, { method: "GET" }).then((res) => {
        return res.json()
    }).then(async (json) => {

        console.log(json)
        
    })
}

function EveningNews(client) {
    console.log("It's time for the evening newsletter!")

    const mainURL = `https://api.newscatcherapi.com/v2/latest_headlines?page_size=25&when=24h&countries=US&topic=politics&lang=en&sources=cnn.com,nytimes.com,foxnews.com,nbcnews.com,politico.com,npr.org,apnews.com,reuters.com,thehill.com,usatoday.com,washingtonpost.com,cbsnews.com`;
    const mainHeader = {
        "X-API-Key": config.newscatcherAPI,
    }

    fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
        return res.json()
    }).then(async (json) => {

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

        const sendChannel = client.guilds.cache.get('760275642150420520').channels.cache.get("775494762216161341")

        const postButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('poststory')
            .setLabel('Post')
            .setStyle(ButtonStyle.Success),
        )

        json.articles.forEach((element) => { // Cycle through each post to organize them.
            if (element.is_opinion === false) { // Check to make sure it's not marked as an opinion piece.
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
        });

        const documents = await newsletterData.find()

        documents.forEach((profile) => {
            const newsletterEmbed = new EmbedBuilder()
            .setColor("White")
            .setTitle("🗞️  Daily Evening Newsletter  🌆")
            .setDescription("Here are some of the top stories today:")
            .setFooter({ text: "Data provided by NewsCatcherAPI"})
            .setTimestamp();
            if (profile.EveningNewsletter === true) {
                console.log(`${profile.UserID} - ${profile.CNN} `)
                if (profile.CNN) {
                    let cnnStories = [];
                    cnn.forEach(story => {
                        cnnStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = cnnStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:CNN:1057383664524210216>  Top CNN Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want CNN!`)
                }
                console.log(`${profile.UserID} - ${profile.Fox} `)
                if (profile.Fox) {
                    let foxStories = [];
                    foxnews.forEach(story => {
                        foxStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = foxStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:FoxNews:1057383666139017306>  Top Fox News Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want Fox!`)
                }
                console.log(`${profile.UserID} - ${profile.NyTimes} `)
                if (profile.NyTimes) {
                    let nytimesstories = [];
                    nytimes.forEach(story => {
                        nytimesstories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = nytimesstories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:TheNewYorkTimes:1057383669792260106>  Top New York Times Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want NYT!`)
                }
                console.log(`${profile.UserID} - ${profile.TheHill} `)
                if (profile.TheHill) {
                    let hillStories = [];
                    thehill.forEach(story => {
                        hillStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = hillStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                        newsletterEmbed.addFields({ name: `<:TheHill:1057383675144183968>  Top The Hill Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want The Hill!`)
                }
                console.log(`${profile.UserID} - ${profile.NBCNews} `)
                if (profile.NBCNews) {
                    let nbcStories = [];
                    nbcnews.forEach(story => {
                        nbcStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = nbcStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:NBCNews:1057383667565088819>  Top NBC News Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want NBC News!`)
                }
                console.log(`${profile.UserID} - ${profile.CBSNews} `)
                if (profile.CBSNews) {
                    let cbsStories = [];
                    cbsnews.forEach(story => {
                        cbsStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = cbsStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:CBSNews:1057383663463055530>  Top CBS News Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want CBS News!`)
                }
                console.log(`${profile.UserID} - ${profile.POLITICO} `)
                if (profile.POLITICO) {
                    let politicoStories = [];
                    politico.forEach(story => {
                        politicoStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = politicoStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:POLITICO:1057383672845697145>  Top POLITICO Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want POLITICO!`)
                }
                console.log(`${profile.UserID} - ${profile.NPR} `)
                if (profile.NPR) {
                    let nprStories = [];
                    npr.forEach(story => {
                        nprStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = nprStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:NPR:1057383668487827536>  Top NPR Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want NPR!`)
                }
                console.log(`${profile.UserID} - ${profile.APNews} `)
                if (profile.APNews) {
                    let apStories = [];
                    apnews.forEach(story => {
                        apStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = apStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:APNews:1057384350607495280>  Top AP News Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want AP News!`)
                }
                console.log(`${profile.UserID} - ${profile.Reuters} `)
                if (profile.Reuters) {
                    let reuStories = [];
                    reuters.forEach(story => {
                        reuStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = reuStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:Reuters:1057383673990758470>  Top Reuters Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want Reuters!`)
                }
                console.log(`${profile.UserID} - ${profile.WashPost} `)
                if (profile.WashPost) {
                    let wapoStories = [];
                    washingtonpost.forEach(story => {
                        wapoStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = wapoStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:TheWashingtonPost:1057383707289321542>  Top Washington Post Headlines`, value: joined.substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want WaPo!`)
                }
                console.log(`${profile.UserID} - ${profile.USAToday} `)
                if (profile.USAToday) {
                    let usatodayStories = [];
                    usatoday.forEach(story => {
                        usatodayStories.push({ author: story.author, title: story.title, link: story.link, excerpt: story.excerpt})
                    })
                    let joined = usatodayStories.map(obj => `**[${obj.title}](${obj.link})**\n${obj.excerpt}`).join('\n\n');
                    if (joined.length === 0) { joined = "There were no major stories published within the last 24 hours."}
                    newsletterEmbed.addFields({ name: `<:USAToday:1057383705829724170>  Top USA Today Headlines`, value: joined.substring(0, 1024).substring(0, 1024) })
                } else {
                    console.log(`${profile.UserID} did not want USA Today!`)
                }
    
                // Now, send them their newsletter!
    
                const user = client.guilds.cache.get(`${profile.GuildID}`).members.cache.get(`${profile.UserID}`)
    
                user.send({ embeds: [newsletterEmbed] }).catch(err => {
                    console.log(`Could not send newsletter to UserID ${profile.UserID}. DMs may be closed, or another error was encountered.`)
                });
                client.guilds.cache.get('760275642150420520').channels.cache.get('775494762216161341').send(`Sent a newsletter to ${user.displayName} - ${user.id}`)
            }
        });
    })
}

module.exports = {
    MorningNews: MorningNews,
    EveningNews, EveningNews
}