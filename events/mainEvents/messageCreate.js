const { EmbedBuilder, ChannelType } = require("discord.js");
const { execute } = require("./ready");
const xp = require("simply-xp");
const ms = require('ms');
const fs = require('fs');
const path = require('path');
const natural = require('natural');
const config = require("../../config.json");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.guild) {
      user = message.author;
      member = message.guild.members.cache.get(message.author.id);

      //News
      if (message.channel.type === ChannelType.GuildAnnouncement) {
        if (message.crosspostable) {
          message.crosspost().catch(console.error);
        }
      }

      if (message.channel.id == "1129097950635753522" && message.author.id != "178689418415177729") {
        message.delete()
      }

      if (message.author.bot) {
        return;
      }

      const up = client.emojis.cache
        .find((emoji) => emoji.name == "upvote")
        .toString();
      const down = client.emojis.cache
        .find((emoji) => emoji.name == "downvote")
        .toString();
      const neut = client.emojis.cache
        .find((emoji) => emoji.name == "neutralvote")
        .toString();

      if (message.channel.id === "927365081371652137") {
        await message.react(up);
        await message.react(neut);
        await message.react(down);
      }

      //Filtered messages

      // if (message.author.id === "268362876346040320") {
      //   message.channel.send(
      //     "Gott spoke, but he doesn't believe Ray can code a bot. So, his first amendment rights have been abolished."
      //   );
      //   message.member.timeout(5 * 1000);
      //   message.delete();
      // }
      //AMERICAA
      // if ((message.author.id === "964446816378695730" || message.author.id == "488434734603698196" || message.author.id == "999108427265609768" || message.author.id == "552283716882268164" || message.author.id == "267790663125434370" || message.author.id == "1116081598958416075" ) && message.channel.id == "760275642150420523") {
      //   message.reply(
      //     "https://www.archives.gov/founding-docs/declaration-transcript \nhttps://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNnN3Vubjc2ZGZ2Mmp3a29sa2h1cm1qYXE0cmF5cG0wamFzdmk2diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hXJ1MWMzY7Af32UIUD/giphy.gif \nhttps://www.youtube.com/shorts/TPY0O1BHF2g"
      //   )
      //   message.channel.send(
      //     "AMERICAAAAAAAAAAAAAAAAAAAAAAAA :flag_us: :flag_us: :flag_us: :flag_us: :flag_us: :flag_us: FREEEEEDOOOOOOOOM RAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHH"
      //   )
      //   message.channel.send(
      //     "**We the People** of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America."
      //   )
      //   message.channel.send(
      //     "I pledge allegiance to the Flag of the United States of America, and to the Republic for which it stands, one Nation under God, indivisible, with liberty and justice for all."
      //   )
      //   message.channel.send(
      //     "https://www.youtube.com/watch?v=sDRRXq41rac\nO say can you see by the dawn's early light\nWhat so proudly we hailed at the twilight's last gleaming\nWhose broad stripes and bright stars through the perilous fight\nO'er the ramparts we watched, were so gallantly streaming?\nAnd the rocket's red glare, the bombs bursting in air\nGave proof through the night that our flag was still there\nO say does that star-spangled banner yet wave\nO'er the land of the free and the home of the brave"
      //   )
      // }

      // if (message.content.toLowerCase().includes("lgbt") || message.content.toLowerCase().includes("gay") || message.content.toLowerCase().includes("drag") || message.content.toLowerCase().includes("twink") || message.content.toLowerCase().includes("sodomy") || message.content.toLowerCase().includes("queer") || message.content.toLowerCase().includes("trans") || message.content.toLowerCase().includes("lesb") || message.content.toLowerCase().includes("genital") || message.content.toLowerCase().includes("hrt") || message.content.toLowerCase().includes("sex") || message.content.toLowerCase().includes("vagina") || message.content.toLowerCase().includes("penis") || message.content.toLowerCase().includes("gender")) {
      //   message.reply("<@178689418415177729> this might qualify to end the challenge!!")
      // }

      function scrambleWord(word) {
        return word.split('').sort(() => 0.5 - Math.random()).join('');
      }

      function scramblePhrase(phrase) {
        return phrase.split(' ').map(word => scrambleWord(word)).join(' ');
    }

      // if (message.content.toLowerCase().includes("waffle") && message.content.toLowerCase().includes("pancake")) {
      //   let scrambledWaffle = scrambleWord("waffle");
      //   let scrambledPancake = scrambleWord("pancake");

      //   message.reply(`:waffle: ` + scrambledWaffle + ` and :pancakes: ` + scrambledPancake);
      // } else if (message.content.toLowerCase().includes("waffle")) {
      //   let scrambledWaffle = scrambleWord("waffle");
      //   message.reply(`:waffle: ` + scrambledWaffle);
      // } else if (message.content.toLowerCase().includes("pancake")) {
      //   let scrambledWaffle = scrambleWord("pancake");
      //   message.reply(`:pancakes: ` + scrambledWaffle);

      // }

      // if ((message.content.toLowerCase().includes("china") || message.content.toLowerCase().includes("taiwan") || message.content.toLowerCase().includes("turkey") || message.content.toLowerCase().includes("america") || message.content.toLowerCase().includes("christian")) && message.channel.id === "760275642150420523") {
      //   message.reply( `${scramblePhrase(message.content)}` )
      // }
      

      if (message.content.toLowerCase().includes("socialism is when")) {
        message.reply("https://www.youtube.com/watch?v=rgiC8YfytDw");
      }
      if (
        message.content.toLowerCase().includes("sounds like commie") ||
        message.content.toLowerCase().includes("sounds like some commie") ||
        message.content.toLowerCase().includes("commie") ||
        message.content.toLowerCase().includes("proletariat") ||
        message.content.toLowerCase().includes("wagie") ||
        message.content.toLowerCase().includes("bourgeoisie")
      ) {
        message.reply(
          "https://cdn.discordapp.com/attachments/928407503690149939/1062530628257583104/commie.mp4"
        );
      }
      if (
        message.content.toLowerCase().includes("they're eating the dogs") ||
        message.content.toLowerCase().includes("theyre eating the dogs")
      ) {
        message.reply("https://cdn.discordapp.com/attachments/775494762216161341/1283592732853403720/Trump__They_re_eating_the_dogs_the_cats.mp4?ex=66e38e63&is=66e23ce3&hm=3050f64ea3553c1fda19f5708fc5bd6d9462c643ad48332db3d0fc149b241393&")
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
        // message.content.toLowerCase().includes("trans bathrooms") ||
        // message.content.toLowerCase().includes("trans athlete") ||
        // message.content.toLowerCase().includes("trans people") ||
        // message.content.toLowerCase().includes("transsexual") ||
        // message.content.toLowerCase().includes("trans gender") ||
        // message.content.toLowerCase().includes("transgender") ||
        // message.content.toLowerCase().includes("trans-gender") ||
        // message.content.toLowerCase().includes("trans-sexual") ||
        // message.content.toLowerCase().includes("tran-sexual") ||
        // message.content.toLowerCase().includes("gender") ||
        // message.content.toLowerCase().includes("breast augmentation") ||
        // message.content.toLowerCase().includes("pedo") ||
        // message.content.toLowerCase().includes("hormone") ||
        // message.content.toLowerCase().includes("blocker") ||
        // message.content.toLowerCase().includes("puberty") ||
        // message.content.toLowerCase().includes("genital")  
      ) {
        message.reply(":clown:");
      }

      // if (message.author.id === "1084288779096965213" || message.author.id === "542504628970061857") {
      //   message.reply("🤡")
      // }

      // Logging messages
      // let messages = [];

      // function addLog(messageObj, messageAuthor) {
      //   messages.push(messageObj.content);

      //   const filePath = path.join(__dirname, 'messagelogs', `${messageAuthor}.json`)

      //   fs.writeFile(filePath, JSON.stringify(messages), (err) => {
      //     if (err) throw err;
      //     console.log('Message added and saved to file!')
      //   });
      // }

      // function readJSONFile(filePath, callback) {
      //   fs.readFile(filePath, 'utf-8', (err, data) => {
      //     if (err) {
      //       addLog(message, message.author.id)
      //       return;
      //     }

      //     try {
      //       const obj = JSON.parse(data);
      //       callback(null, obj);
      //     } catch (err) {
      //       addLog(message, message.author.id);
      //     }
      //   });
      // }

      // function writeJSONFile(filePath, obj, callback) {
      //   fs.writeFile(filePath, JSON.stringify(obj), callback);
      // }

      // function addStringsToFile(filePath, newStrings) {
      //   readJSONFile(filePath, (err, data) => {
      //     if (err) throw err;

      //     data.push(...newStrings);

      //     writeJSONFile(filePath, data, (err) => {
      //       if (err) throw err;
      //       console.log("New message data added to the file!")
      //     });
      //   });
      // }

      // if (message.content.length > 10) {
      //   const filePath = path.join(__dirname, 'messagelogs', `${message.author.id}.json`)
      //   const newStrings = [`${message.content}`]
      //   addStringsToFile(filePath, newStrings)
      // }

    }
  },
};
