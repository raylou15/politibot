const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn more about the bot and commands"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const commandEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Operation Politibot Help & Info")
      .setDescription(
        `Below we try to give you a brief overview of all of our commands and what their purpose is! Operation Politibot hosts dozens of commands and features for you to use, so be sure to check them out! \n\nYou can always make suggestions by using </suggest:1048448592622387270>!` +
        `\n\n</dadjoke:1053090107374182541> - Generate a random dad joke` + `\n</demographics:1062544239638085692> - See data about the demographics of our server` + `\n</funfact:1054869621263585363> - Generates a random fun fact` + `\n</pierceslaw:1095234774668419134> - Pierce's Law of Operation Politics Discussions` + `\n</rps paper:1053099238923440191> </rps rock:1053099238923440191> </rps scissors:1053099238923440191> - Play rock, paper, scissors with the bot!` + `\n</suggest:1048448592622387270> - Make suggestions for the server, the bot, or anything else!` +
        `\n\n</xpleaderboard:1057118160853155862> - See the leaderboard for levels in our server` + `\n</rank:1057091053221589103> - Check out your (or another user's) rank!` +
        `\n\n</report:1044451244019830907> - Report a message or a user for violating the rules` + '\nYou can also open a ticket in <#999439440273473657> or right click a message (not a user), click `Apps` and then click `Report Message`!' +
        `\n\nWe also host some great research tools you can explore!` + `\n</congressmember:1053437249276092476> - Look up Members of Congress!` + `\n</searchbills help:1053492027209298051> - See how to use our very in-depth bill searching feature` + '\n</mediabiascheck:1095204083708723200> - Check the bias ratings of various news sources. You can also right click a message (not a user), click `Apps` and then click `Check News Source`!' +

        `\n\n</changemymind create:1097356868399140974> - Open a public voice channel stage that you control on a debate topic of your choosing` + 

        `\n\nAre you a moderator looking for a list of moderator commands? Use </modhelp:1105926011020906556>! Or, if you're interested in seeing our Premium Commands available to boosters and donaters, use </premiumhelp:1105927414921580644>!`
      
      )
      .setFooter({ text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━" });



    interaction.reply({ embeds: [commandEmbed], ephemeral: true });
  },
});
