const { EmbedBuilder, ChannelType } = require("discord.js");
const { execute } = require("./ready");
const debateTerms = require('./debateTerms.json');
const greetingTerms = require('./greetings.json');

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.guild) {
      
      //Random chance generator and greeting chooser
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      const randomGreetingIndex = Math.floor(Math.random() * greetingTerms.greetings.length);
      const greeting = greetingTerms.greetings[randomGreetingIndex];

      if (randomNumber === 1) {

        //True or False values on all the term lists
        const containsLGBTQTerms = debateTerms.lgbtq.some(term => message.content.toLowerCase().includes(term))
        const containsGenocideTerms = debateTerms.genocide.some(term => message.content.toLowerCase().includes(term))

        //Handle embeds!
        if (containsLGBTQTerms) {
          const lgbtEmbed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setDescription(`${greeting} \n\nI can see this discussion is probably about something to do with the LGBTQ+ community or topics. I just want to take a moment to remind everyone to check out our <#775838975755681842> and be wary of rules 6, 12, and 13. Above all else, remain respectful, open-minded, and calm! If you feel somebody is violating the rules, don't make the situation worse. Instead, <#999439440273473657>. Otherwise, have fun discussing and debating!`)
          .setFooter({ text: "This was an automated response. Please open a ticket if you think this was in error."})

          message.channel.send({ embeds: [lgbtEmbed] })
        }

        if (containsGenocideTerms) {
          const genocideEmbed = new EmbedBuilder()
          .setColor("NotQuiteBlack")
          .setDescription(`${greeting} \n\nIt feels like this discussion has something to do with mass atrocities or genocides. While we do allow those kinds of debates, we also actively discourage them because they tend to quickly tread onto rule-violating territory. However, if you want to keep debating and discussing, that's fine! Here's the three criteria by which we determine whether or not a genocide is classified as a genocide: \n- Recognition by the United Nations \n- Recognition by the United States \n- Recognition by a majority of countries \n\nTo that end, we do classify things like the Uygher and Armenian genocides and the Holodomor as genocides, and there is no debate to be had on that because we won't change our minds. **Violating R11 and actively denying genocides will land you harsh punishments and possibly getting reported to Discord.** Other than that, please keep in mind <#775838975755681842> and stay civil! Have fun debating and discussing!`)
          .setFooter({ text: "This was an automated response. Please open a ticket if you think this was in error."})

          message.channel.send({ embeds: [genocideEmbed] })
        
        }



      }
    }
  },
};
