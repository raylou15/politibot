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
    ComponentType,
    Embed,
  } = require("discord.js");
  const client = module.exports = {
    name: "mediabiasInfo",
    description: "Media Bias Tool Information",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        const infoEmbed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle("❓  Media Political Bias Ratings: More Info")
        .setDescription("This tool is provided as a means of allowing discussions in Operation Politics to have better sources and instant reliability checks without having to spend minutes going off Discord to find out if somebody's source is credible or not. We don't expect this tool to be perfect, nor completely accurate, but it is generally very reliable and accurate with over 5,000 sources covered. Below, we have some extra information about this tool that you might find useful.")
        .setFields([
            {
                name: "🖨️ How does this work?",
                value: "We use a [Political Bias Database](https://rapidapi.com/albertoescobar/api/political-bias-database) that contains data from [AllSides](https://rapidapi.com/albertoescobar/api/political-bias-database) and [Media Bias/Fact Check](https://rapidapi.com/albertoescobar/api/political-bias-database). If those sites have information about a particular website, we will be able to display that data to you for your benefit.",
                inline: true
            },
            {
                name: "⚠️ It said that no data was found!",
                value: "This is likely because of one of three possibilities. Either you didn't give us the correct website in the expected format, the website simply isn't covered by AllSides or Media Bias/Fact Check due to being irrelevant, or the source is very obscure, niche, and thus probably unreliable.",
                inline: true
            },
            {
                name: "🤬 These ratings suck! They're biased!",
                value: "While it is possible that the ratings may be wrong or biased, it's extremely unlikely. Both AllSides and Media Bias/Fact Check go through rigorous processes that are publicly vetted in order to provide the best and most accurate rating possible. You can read more for [AllSides](https://www.allsides.com/media-bias/media-bias-rating-methods) and [Media Bias/Fact Check](https://mediabiasfactcheck.com/methodology/). It doesn't really matter if you dislike the ratings, they're probably accurate regardless of how you perceive those sources.",
                inline: false
            },
            {
                name: "🔥 Why is this even important? Isn't truth subjective?",
                value: "While it is true that your perception on various issues can cause you to see the world in different ways, it is still very important to acknowledge the necessity of using reliable sources regardless of what side of the political spectrum you're on. This tool is an attempt at helping encourage those good practices. We even encourage you to check out the Google Chrome extension, too!",
                inline: true
            },
            {
                name: "🤔 How should I use this?",
                value: "You can use this for pure curiosity, or use it to check the reliability of people's sources during discussions and debates to help hold everyone in our server to a higher standard of reliability. Better sourcing of information always leads to better and more informed debates, so use it in whatever ways suits you. Try not to be too annoying with it, please.",
                inline: true
            },
        ])
        .setFooter({text: "Credit: Allsides, Media Bias/Fact Check, and Political Bias Database (Alberto Escobar)", iconURL: interaction.guild.iconURL()});

        await interaction.reply({ embeds: [infoEmbed], ephemeral: true })

    },
  };
  
