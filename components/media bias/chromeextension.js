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
    name: "chromeextension",
    description: "Chrome Extension Information",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        const infoEmbed = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle("🌐  Media Bias Ratings: Chrome Extension")
        .setDescription("If you enjoy the services that this tool provides, then we'd recommend checking out the [Chrome Extension](https://chrome.google.com/webstore/detail/transparent-media/cmikakklbcjifcpcjlkdcbjdkmmmnpam) developed by the same person that made the API we use. \n\nThis Chrome Extension helps you identify reliable news and media sources as soon as you enter them, by being able to access AllSides and Media Bias/Fact Check ratings either from the Extensions tab or even on Google Search and Google News, as demonstrated in the attached screenshot below. \n\nThis Chrome Extension is a great way to find reliable and trustworthy news sources and articles very quickly, and even discover bias ratings for sites you didn't even know needed them. We highly recommend checking it out!")
        .setImage('https://i.imgur.com/5iimIwJ.png')
        .setFooter({text: "Credit: Allsides, Media Bias/Fact Check, and Political Bias Database (Alberto Escobar)", iconURL: interaction.guild.iconURL()});

        await interaction.reply({ embeds: [infoEmbed], ephemeral: true })

    },
  };
  
