const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonComponent,
  Component,
  SelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuInteraction,
  ButtonInteraction,
} = require("discord.js");
const verifyData = require("../../schemas/verificationdata");
module.exports = {
  name: "faqbutton",
  description: "frequently asked questions",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const logChannel =
      interaction.guild.channels.cache.get("984871497640321025");
    const logEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`${interaction.user.username} has clicked the FAQ button!`);

    const faqEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Learn more about Operation Politics")
      .setDescription(
        "We're aiming to develop an environment in this server conducive to civil debate and discussion among all viewpoints in the United States. We get a lot of questions, so here are some of the most common ones below:"
      )
      .addFields(
        {
          name: "🗳️  I'm a conservative/liberal, am I welcomed here?",
          value:
            "Definitely! We tolerate all viewpoints here, but what we **don't** tolerate is incivility or bad faith behavior. That goes for any ideological viewpoint — our rules are designed to promote good faith discussion and keep out nasty, unwarranted commentary that would otherwise disrupt positive conversations.",
          inline: true,
        },
        {
          name: "⚠️ Wait, what's the difference between good faith and bad faith discussion?",
          value:
            "I encourage you to check out [this page](https://www.cato.org/sites/cato.org/files/2020-07/Good_Faith-vs-Bad_Faith-Arguments_or_Discussions.pdf) to help understand the difference between good and bad faith discussion. However, simply put: good faith discussion is hearing out the other side, remaining respectful, and engaging in a serious conversation, and bad faith discussion has hidden agendas or toxic behavior.",
          inline: true,
        },
        {
          name: "🗣️  What's the expected seriousness or attitude of debate here?",
          value:
            "You should do your best to be honest, genuine, and well-spoken during these debates. This means [avoiding debate fallacies](https://thebestschools.org/magazine/15-logical-fallacies-know/) as much as possible, [practicing good formal debating methods](https://www.sfu.ca/cmns/130d1/HOWTODEBATE.htm#:~:text=be%20stared%20at.-,Content,the%20other%20side%E2%80%99s%20case%20to%20be%20flawed%20in%20the%20key%20areas.,-Sources) when possible, and be sure to listen to your opponent and make reasonable arguments. Of course, we have separations for **serious** and **less-serious** discussions, so you can choose your own style and what works better for you. But, we still expect our rules to be respected and good-faith discussion to ensue even when you take on less-serious conversations.",
        },
        {
          name: "⛔ What in the world is 'Partisan Extremism?'",
          value:
            "As said before, we tolerate all viewpoints here. However, we define partisan extremism exactly as it is defined in our rules — spreading partisan misinformation with no factual basis; support of violent extremist groups or violent extremist figures; suggesting the exclusion of a group of people; political party; or otherwise from government or society; advocating the violent overthrow of government",
          inline: true,
        },
        {
          name: "❓ Who determines what is or is not 'misinformation'?",
          value: `Our staff does, collectively. We usually try to give you a chance to provide serious, academic/professional sources before hitting you with a rule violation. If you can reasonably back up your point with facts, then we don't mind, as long as the information you're providing isn't against one of our other rules. "There are no sources on this" or "all sources are biased" is not an acceptable defense for not providing support to your claims.`,
          inline: true,
        },
        {
          name: "🤝 Have we sold you yet?",
          value:
            "Our diverse staff team and community is ready to welcome you in — come join us in our journey to create a better place to debate. We'd love to have you!",
        }
      )
      .setFooter({ text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━" });

    interaction.reply({ embeds: [faqEmbed], ephemeral: true });
    logChannel.send({ embeds: [logEmbed] });
  },
};
