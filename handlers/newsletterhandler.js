const { EmbedBuilder } = require("@discordjs/builders");
const schedule = require("node-schedule");
const config = require("../config.json");
const newsletterData = require("../schemas/newslettersubs");

const morningJob = schedule.scheduleJob(`0 0 8 * * *`, function() {
    console.log("It's time for the morning newsletter!")

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

        const newsletterEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("🗞️  Daily Morning Newsletter  🌅")
        .setDescription("Here are some of the top stories today:")
        .setFooter({ text: "Data provided by NewsCatcherAPI"})
        .setTimestamp();

        newsletterData.forEach((profile) => {
            if (profile.MorningNewsletter === true) {
                if (profile.CNN === true) {
                    let cnnStories = [];
                    cnn.forEach(story => {
                        cnnStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = cnnStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top CNN Headlines`, value: joined })
                    })
                }
                if (profile.Fox === true) {
                    let foxStories = [];
                    foxnews.forEach(story => {
                        foxStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = foxStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Fox News Headlines`, value: joined })
                    })
                }
                if (profile.NyTimes === true) {
                    let nytimesstories = [];
                    nytimes.forEach(story => {
                        nytimesstories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nytimesstories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top New York Times Headlines`, value: joined })
                    })
                }
                if (profile.TheHill === true) {
                    let hillStories = [];
                    thehill.forEach(story => {
                        hillStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = hillStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top The Hill Headlines`, value: joined })
                    })
                }
                if (profile.NBCNews === true) {
                    let nbcStories = [];
                    nbcnews.forEach(story => {
                        nbcStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nbcStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top NBC News Headlines`, value: joined })
                    })
                }
                if (profile.CBSNews === true) {
                    let cbsStories = [];
                    cbsnews.forEach(story => {
                        cbsStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = cbsStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top CBS News Headlines`, value: joined })
                    })
                }
                if (profile.POLITICO === true) {
                    let politicoStories = [];
                    politico.forEach(story => {
                        politicoStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = politicoStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top POLITICO Headlines`, value: joined })
                    })
                }
                if (profile.NPR === true) {
                    let nprStories = [];
                    npr.forEach(story => {
                        nprStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nprStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top NPR Headlines`, value: joined })
                    })
                }
                if (profile.APNews === true) {
                    let apStories = [];
                    apnews.forEach(story => {
                        apStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = apStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top AP News Headlines`, value: joined })
                    })
                }
                if (profile.Reuters === true) {
                    let reuStories = [];
                    reuters.forEach(story => {
                        reuStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = reuStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Reuters Headlines`, value: joined })
                    })
                }
                if (profile.WashPost === true) {
                    let wapoStories = [];
                    washingtonpost.forEach(story => {
                        wapoStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = wapoStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Washington Post Headlines`, value: joined })
                    })
                }
                if (profile.USAToday === true) {
                    let usatodayStories = [];
                    usatoday.forEach(story => {
                        usatodayStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = usatodayStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top USA Today Headlines`, value: joined })
                    })
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
})


schedule.scheduleJob(`15 8 * * *`, function() {
    console.log("It's time for the evening newsletter!")

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

        const newsletterEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("🗞️  Daily Evening Newsletter  🌆")
        .setDescription("Here are some of the top stories today:")
        .setFooter({ text: "Data provided by NewsCatcherAPI"})
        .setTimestamp();

        newsletterData.forEach((profile) => {
            if (profile.EveningNewsletter === true) {
                if (profile.CNN === true) {
                    let cnnStories = [];
                    cnn.forEach(story => {
                        cnnStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = cnnStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top CNN Headlines`, value: joined })
                    })
                }
                if (profile.Fox === true) {
                    let foxStories = [];
                    foxnews.forEach(story => {
                        foxStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = foxStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Fox News Headlines`, value: joined })
                    })
                }
                if (profile.NyTimes === true) {
                    let nytimesstories = [];
                    nytimes.forEach(story => {
                        nytimesstories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nytimesstories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top New York Times Headlines`, value: joined })
                    })
                }
                if (profile.TheHill === true) {
                    let hillStories = [];
                    thehill.forEach(story => {
                        hillStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = hillStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top The Hill Headlines`, value: joined })
                    })
                }
                if (profile.NBCNews === true) {
                    let nbcStories = [];
                    nbcnews.forEach(story => {
                        nbcStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nbcStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top NBC News Headlines`, value: joined })
                    })
                }
                if (profile.CBSNews === true) {
                    let cbsStories = [];
                    cbsnews.forEach(story => {
                        cbsStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = cbsStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top CBS News Headlines`, value: joined })
                    })
                }
                if (profile.POLITICO === true) {
                    let politicoStories = [];
                    politico.forEach(story => {
                        politicoStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = politicoStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top POLITICO Headlines`, value: joined })
                    })
                }
                if (profile.NPR === true) {
                    let nprStories = [];
                    npr.forEach(story => {
                        nprStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = nprStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top NPR Headlines`, value: joined })
                    })
                }
                if (profile.APNews === true) {
                    let apStories = [];
                    apnews.forEach(story => {
                        apStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = apStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top AP News Headlines`, value: joined })
                    })
                }
                if (profile.Reuters === true) {
                    let reuStories = [];
                    reuters.forEach(story => {
                        reuStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = reuStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Reuters Headlines`, value: joined })
                    })
                }
                if (profile.WashPost === true) {
                    let wapoStories = [];
                    washingtonpost.forEach(story => {
                        wapoStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = wapoStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top Washington Post Headlines`, value: joined })
                    })
                }
                if (profile.USAToday === true) {
                    let usatodayStories = [];
                    usatoday.forEach(story => {
                        usatodayStories.push(story.author, story.title, story.link, story.excerpt)
                        const joined = usatodayStories.map(obj => `[${obj[1]}](${obj[2]})\nBy ${obj[0]}\n${obj[3]}`).join('\n\n');
                        newsletterEmbed.addFields({ name: `Top USA Today Headlines`, value: joined })
                    })
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
})