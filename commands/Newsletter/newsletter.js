const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    messageLink,
  } = require("discord.js");
const fetch = require("node-fetch")
const Parser = require("rss-parser")
const parser = new Parser();
const config = require("../../config.json");
const newsletterData = require("../../schemas/newslettersubs");

const client = (module.exports = {
    data: new SlashCommandBuilder()
      .setName("newsletter")
      .setDescription("Check out the latest news!")
      .addSubcommand((subcommand) => subcommand
        .setName("subscribe")
        .setDescription("Subscribe to the daily newsletter!")
      )
      .addSubcommand((subcommand) => subcommand
        .setName("unsubscribe")
        .setDescription("Quit receiving the newsletter!")
      ), // ALSO ADD AN EDIT SETTINGS FUNCTION!
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {

        if (interaction.guild) {

            if (interaction.options.getSubcommand() === 'subscribe') {

                const firstPrompt = new EmbedBuilder()
                .setColor("White")
                .setTitle("🗞️  Daily Newsletter Subscription")
                .setDescription("We offer our users a Daily Newsletter that will deliver the top headlines of the day to your DMs up to twice a day. This system is fully automated and customizable. Because it only picks the top headlines, there may be a lack of proper article vetting (like what we do in <#775837560651120640>), so be wary of that! You can, however, choose the sources you'd like and whether or not you'd like to receive opinion articles.\n\nThis system will be constantly evolving, so check back later for more features and functionality.\n\n**Below you have several options for news agencies to choose from.** Please select which ones you'd like to receive a newsletter for by reacting with the corresponding reaction, and then click 'DONE'.")
                .setFields({
                    name: 'Available Options:',
                    value: '<:cnn:1057383664524210216>  CNN\n<:foxnews:1057383666139017306>  Fox News\n<:nbcnews:1057383667565088819>  NBC News\n<:cbsnews:1057383663463055530>  CBS News\n<:nytimes:1057383669792260106>  The New York Times\n<:washingtonpost:1057383707289321542>  The Washington Post\n<:thehill:1057383675144183968>  The Hill\n<:politico:1057383672845697145>  POLITICO\n<:reuterslogo:1057383673990758470>  Reuters \n<:npr:1057383668487827536>  NPR \n<:usatoday:1057383705829724170>  USA Today\n<:apnews:1057384350607495280>  AP News'
                })
                .setFooter({ text: "All newsletter data provided courtesy of NewsCatcherAPI • Prompt Expires in 180 Seconds"})
                .setTimestamp();
    
                const doneButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId('donenews')
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId('cancelnews')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
                )
    
                const prompt = await interaction.reply({ embeds: [firstPrompt], components: [doneButton], fetchReply: true })
    
                prompt.react(interaction.guild.emojis.cache.get('1057383664524210216')) // CNN
                prompt.react(interaction.guild.emojis.cache.get('1057383666139017306')) // Fox
                prompt.react(interaction.guild.emojis.cache.get('1057383667565088819')) // NBC
                prompt.react(interaction.guild.emojis.cache.get('1057383663463055530')) // CBS
                prompt.react(interaction.guild.emojis.cache.get('1057383669792260106')) // NYT
                prompt.react(interaction.guild.emojis.cache.get('1057383707289321542')) // WAPO
                prompt.react(interaction.guild.emojis.cache.get('1057383675144183968')) // The Hill
                prompt.react(interaction.guild.emojis.cache.get('1057383672845697145')) // POLITICO
                prompt.react(interaction.guild.emojis.cache.get('1057383673990758470')) // Reuters
                prompt.react(interaction.guild.emojis.cache.get('1057383668487827536')) // NPR
                prompt.react(interaction.guild.emojis.cache.get('1057383705829724170')) // USA Today
                prompt.react(interaction.guild.emojis.cache.get('1057384350607495280')) // AP News
    
                const filter = (i) => {
                    return i.user.id === interaction.user.id;
                };
    
                prompt.awaitMessageComponent({ time: 180_000 }).then(async (interaction) => {
                    buttonClicked = interaction.customId;
    
                    if (buttonClicked === 'cancelnews') {
                        prompt.reactions.removeAll()
                        return interaction.update({ content: "Prompt cancelled.", embeds: [], components: [], fetchReply: false })
                    } else {
                        let chosenNews = [];
    
                        prompt.reactions.cache.forEach(async (reaction) => {
                            if (reaction.count > 1) {
                                chosenNews.push(reaction.emoji.name)
                            }
                        })
    
                        let listed = new EmbedBuilder()
                        .setColor("White")
                        .setTitle("🗞️  Daily Newsletter Subscription")
                        .setDescription(`Please confirm your selections:\n\n` + chosenNews.join("\n"))
                        .setFooter({ text: "All newsletter data provided courtesy of NewsCatcherAPI • Prompt Expires in 180 Seconds"})
                        .setTimestamp();
    
                        const confirmdeny = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setCustomId('confirmnews')
                            .setLabel('Confirm')
                            .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                            .setCustomId('cancelnews')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger)
                        )
    
                        prompt.reactions.removeAll()
                        interaction.update({ embeds: [listed], components: [confirmdeny], fetchReply: false })
    
                        prompt.awaitMessageComponent({ time: 180_000 }).then(async (interaction) => {
                            newButtonClicked = interaction.customId;
    
                            if (newButtonClicked === 'cancelnews') {
                                return interaction.update({ content: "Prompt cancelled.", embeds: [], components: [], fetchReply: false })
                            } else {
    
                                const onceortwice = new EmbedBuilder()
                                .setColor("White")
                                .setTitle("🗞️  Daily Newsletter Subscription")
                                .setDescription("We can send you a newsletter in the morning or evening, or both, at 8 AM and 8 PM respectively. Please react with  🌅  for morning newsletters,  and  🛏️  for evening newsletters, then hit 'Done' to confirm your choice.")
                                .setFooter({ text: "All newsletter data provided courtesy of NewsCatcherAPI • Prompt Expires in 180 Seconds"})
                                .setTimestamp();
    
                                const oncetwiceDone = new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('newsfinal')
                                    .setLabel('Done')
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId('cancelnews')
                                    .setLabel('Cancel')
                                    .setStyle(ButtonStyle.Danger)
                                )
    
                                interaction.update({ embeds: [onceortwice], components: [oncetwiceDone], fetchReply: false })
                                prompt.react("🌅")
                                prompt.react("🛏️")
    
                                prompt.awaitMessageComponent({ time: 180_000 }).then(async (interaction) => {
                                    finalButtonClicked = interaction.customId
                                    
                                    if (newButtonClicked === 'cancelnews') {
                                        return interaction.update({ content: "Prompt cancelled.", embeds: [], components: [], fetchReply: false })
                                    } else {
                                        
                                        const existingData = await newsletterData.findOne({ UserID: `${interaction.user.id}` })
                                        if (existingData) {
                                            console.log("Existing data found! Purging!")
                                            await newsletterData.findOneAndDelete({ UserID: `${interaction.user.id}`})
                                        }
    
                                        let evemorArray = [];
    
                                        prompt.reactions.cache.forEach(async (reaction) => {
                                            if (reaction.count > 1) {
                                                evemorArray.push(reaction.emoji.name)
                                            }
                                        })
    
                                        let cnnValue;
                                        let foxValue;
                                        let nytValue;
                                        let thehillValue;
                                        let nbcValue;
                                        let cbsValue;
                                        let politicoValue;
                                        let nprValue;
                                        let apValue;
                                        let reutersValue;
                                        let washpostValue;
                                        let usatodayValue;
                                        let morningValue; 
                                        let eveningValue;
    
                                        if (chosenNews.includes('CNN')) { cnnValue = true } else { cnnValue = false }
                                        if (chosenNews.includes('FoxNews')) { foxValue = true } else { foxValue = false }
                                        if (chosenNews.includes('TheNewYorkTimes')) { nytValue = true } else { nytValue = false }
                                        if (chosenNews.includes('TheHill')) { thehillValue = true } else { thehillValue = false }
                                        if (chosenNews.includes('NBCNews')) { nbcValue = true } else { nbcValue = false }
                                        if (chosenNews.includes('CBSNews')) { cbsValue = true } else { cbsValue = false }
                                        if (chosenNews.includes('POLITICO')) { politicoValue = true } else { politicoValue = false }
                                        if (chosenNews.includes('NPR')) { nprValue = true } else { nprValue = false }
                                        if (chosenNews.includes('APNews')) { apValue = true } else { apValue = false }
                                        if (chosenNews.includes('Reuters')) { reutersValue = true } else { reutersValue = false }
                                        if (chosenNews.includes('TheWashingtonPost')) { washpostValue = true } else { washpostValue = false }
                                        if (chosenNews.includes('USAToday')) { usatodayValue = true } else { usatodayValue = false }
                                        if (evemorArray.includes('🌅')) { morningValue = true } else { morningValue = false }
                                        if (evemorArray.includes('🛏️')) { eveningValue = true } else { eveningValue = false }
    
                                        let newData = new newsletterData({
                                            GuildID: interaction.guild.id,
                                            UserID: interaction.user.id,
                                            CNN: cnnValue,
                                            Fox: foxValue,
                                            NyTimes: nytValue,
                                            TheHill: thehillValue,
                                            NBCNews: nbcValue,
                                            CBSNews: cbsValue,
                                            POLITICO: politicoValue,
                                            NPR: nprValue,
                                            APNews: apValue,
                                            Reuters: reutersValue,
                                            WashPost: washpostValue,
                                            USAToday: usatodayValue,
                                            MorningNewsletter: morningValue,
                                            EveningNewsletter: eveningValue
                                        })
                                        await newData.save().catch(console.error);
                                        prompt.reactions.removeAll();
                                        interaction.update({ content: "Your newsletter has been set up!", embeds: [], components: [], fetchReply: false });
    
                                    }
    
                                }).catch(err => {
                                    console.log(err)
                                    return interaction.update({ content: "Prompt timed out or encountered an error.", embeds: [], components: [], fetchReply: false})
                                })
    
                            }
    
    
                        }).catch(err => {
                            console.log(err)
                            return interaction.update({ content: "Prompt timed out or encountered an error.", embeds: [], components: [], fetchReply: false})
                        })
                    }
    
                }).catch(err => {
                    console.log(err)
                    return interaction.update({ content: "Prompt timed out or encountered an error.", embeds: [], components: [], fetchReply: false})
                })
    
            }
    
    
            if (interaction.options.getSubcommand() === 'unsubscribe') {
                await newsletterData.findOneAndDelete({ UserID: interaction.user.id })
                interaction.reply({ content: "You have unsubscribed from your daily newsletter."})
            }

        } else {
            return interaction.reply("This prompt has to be done in DMs with the bot, both for security as well as to ensure you have your DMs open!")
        }
        
    },
});
  