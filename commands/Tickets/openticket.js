const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
  } = require("discord.js");
  const client = (module.exports = {
    data: new SlashCommandBuilder()
      .setName("openticket")
      .setDescription("Contact Server Staff and Open a Ticket."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const ticketsChannel = client.channels.cache.get("1053882820684169266");
        const server = client.guilds.cache.get("760275642150420520");
        
        const memberDiscriminator1 = interaction.user.tag.replace("#", "-")
        const memberDiscriminator = memberDiscriminator1.replace(" ", "_")
        const discrimLength = memberDiscriminator.length

        //Check to see if User has a ticket already!
        ticketsArray = [];
        if (ticketsChannel.threads.cache.find(x => x.name.substring(0, discrimLength) === memberDiscriminator)) { // Found an active thread.
            ticketsChannel.threads.cache.forEach(element => {
                if (element.name.substring(0, discrimLength) === memberDiscriminator) {
                        ticketsArray.push(element)
                }
            })

            if (ticketsArray[ticketsArray.length - 1].archived === false) { // Active thread found! Error it out.
                const alreadyOpenEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("You already have an active ticket. Please reply in your DMs to the Politibot.")
                return interaction.reply({ embeds: [alreadyOpenEmbed]})
            } else {
                const firstPromptDM = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("Operation Politics Modmail System")
            .setDescription("If you are trying to open a ticket, read below. Otherwise, ignore this prompt.\n\n`Appeals` - Open a ticket to appeal a mod action (such as a mute, warn, etc)\n`Moderation` - Report users, ask questions about the rules, or for verification or other moderation inquiries.\n`Bot Support` - Need help with the bot, or have suggestions?\n`Partnerships` - For partnering with our server.\n`Other` - Anything that doesn't fit into the other categories.\n\nPlease make a decision and click the corresponding button below!")
            .setFooter({ text: "Select an option below will open a ticket under that category. This prompt will expire in 180 seconds." })
            .setTimestamp();

            const categoryButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('appeals')
                .setLabel('⚖️ Appeals')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('moderation')
                .setLabel('🔨 Moderation')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('botsupport')
                .setLabel('🤖 Bot Support')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('partnerships')
                .setLabel('🤝 Partnerships')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('other')
                .setLabel('❔ Other')
                .setStyle(ButtonStyle.Secondary),
            )

            const dmErrorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) - your settings must be set to 'everyone'");

            const prompt = await interaction.user.send({ embeds: [firstPromptDM], components: [categoryButtons] }).catch(async (err) => {
                console.log(err);
                return interaction.reply({ embeds: [dmErrorEmbed], ephemeral: true });
            });

            interaction.reply({ content: "Check your DMs and proceed there!", ephemeral: true})

            const filter = (i) => {
                return i.user.id === interaction.user.id;
            };

            (await prompt).awaitMessageComponent({ time: 180_000 }).then(async (interaction) => {
                buttonClicked = interaction.customId;

                const secondPrompt = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`You selected **${buttonClicked}**. Now, please give us a reason why you're opening this ticket. Provide us with message links if possible, or as much detail as necessary to help us solve your situation.`)
                .setFooter({ text: 'The bot will only look for messages for 180 seconds before timing out.'});

                const promptModal = new ModalBuilder()
                .setCustomId('promptmodal')
                .setTitle('Reason for Ticket');

                const reasonInput = new TextInputBuilder()
                .setCustomId('reasoninput')
                .setLabel('Give us as much information as possible:')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(2000)
                .setPlaceholder('Type your reason here. This prompt expires in 180 seconds. Do not click off of this prompt.')
                .setRequired(true);

                const modalRow = new ActionRowBuilder().addComponents(reasonInput)

                promptModal.addComponents(modalRow)

                await interaction.showModal(promptModal)

                const reasonGiven = await interaction.awaitModalSubmit({ time: 180_000 }).then(async (interaction) => {

                    const reasonGiven = interaction.fields.getTextInputValue('reasoninput')

                    const finalEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("New Ticket Opened:")
                    .addFields([
                        { name: "Category", value: `${buttonClicked}` },
                        { name: "Reason", value: `${reasonGiven}` }
                    ])
                    .setFooter({ text: "Please be patient and await a response from staff."})
                    .setTimestamp();

                    let mentionVal; // Set up mentions
                    if (buttonClicked === "appeals") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920>"
                    } else if (buttonClicked === "moderation") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139>"
                    } else if (buttonClicked === "botsupport") {
                        mentionVal = "<@178689418415177729>"
                    } else if (buttonClicked === "partnerships") {
                        mentionVal = "<@178689418415177729> <@&927316457233186846>"
                    } else if (buttonClicked === "other") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139> <@&1013285748012757053> <@&927317020867969074>"
                    }

                    const archivedChannels = await ticketsChannel.threads.fetchArchived({ fetchAll: true })
                    const archivedThreads = await archivedChannels.threads
                    const archivedNums = [];

                    archivedThreads.forEach(element => {
                        archivedNums.push(nameTemp = element.name.split("-")[2])
                    })

                    const claimCloseButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId('claimthread')
                        .setLabel('Claim')
                        .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                        .setCustomId('closethread')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger),
                    );

                    const embedOpen = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("New Ticket Opened")
                    .setAuthor({ name: interaction.user.tag, value: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setFields([
                        { name: "Category", value: buttonClicked },
                        { name: "Reason", value: reasonGiven }
                    ])
                    .setFooter({ text: "Please claim the ticket before proceeding."})

                    console.log(`buttonClicked: ${buttonClicked}`)
                    const tagArray = [];
                    ticketsChannel.availableTags.forEach(element => {
                        if (element.name.toLowerCase() === `${buttonClicked}`) {
                            tagArray.push(element.id)
                        }
                        if (element.name.toLowerCase() === `unclaimed`) {
                            tagArray.push(element.id)
                        }
                    })
                    const chosenTag = tagArray[0]
                    const unclaimedTag = tagArray[1]

                    if (!archivedNums.length) { //If there are no threads, start from 1.
                        ticketsChannel.threads.create({
                            name: `${memberDiscriminator}-1`,
                            autoArchiveDuration: 10080,
                            message: ({ content: mentionVal, embeds: [embedOpen], components: [claimCloseButtons] }),
                            reason: 'User Opened Ticket',
                            appliedTags: [chosenTag, unclaimedTag]
                        })
                    } else if (archivedNums.length > 0) { //If there are threads, +1
                        const currentNum = (Math.max(...archivedNums))

                        ticketsChannel.threads.create({
                            name: `${memberDiscriminator}-${currentNum + 1}`,
                            autoArchiveDuration: 10080,
                            message: ({ content: mentionVal, embeds: [embedOpen], components: [claimCloseButtons] }),
                            reason: 'User Opened Ticket',
                            appliedTags: [chosenTag, unclaimedTag]
                        })
                    }

                    await interaction.reply({ embeds: [finalEmbed] })
                    return prompt.edit({ content: "All done! Ticket Successfully Opened.", embeds: [], components: [] })

                }).catch(error => {
                    console.log(error)
                    return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
                })

            }).catch(error => {
                console.log(error)
                return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
            })
            }

        } else { // No active thread found. Let's continue!
            const firstPromptDM = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("Operation Politics Modmail System")
            .setDescription("If you are trying to open a ticket, read below. Otherwise, ignore this prompt.\n\n`Appeals` - Open a ticket to appeal a mod action (such as a mute, warn, etc)\n`Moderation` - Report users, ask questions about the rules, or for verification or other moderation inquiries.\n`Bot Support` - Need help with the bot, or have suggestions?\n`Partnerships` - For partnering with our server.\n`Other` - Anything that doesn't fit into the other categories.\n\nPlease make a decision and click the corresponding button below!")
            .setFooter({ text: "Select an option below will open a ticket under that category. This prompt will expire in 180 seconds." })
            .setTimestamp();

            const categoryButtons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('appeals')
                .setLabel('⚖️ Appeals')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('moderation')
                .setLabel('🔨 Moderation')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('botsupport')
                .setLabel('🤖 Bot Support')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('partnerships')
                .setLabel('🤝 Partnerships')
                .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                .setCustomId('other')
                .setLabel('❔ Other')
                .setStyle(ButtonStyle.Secondary),
            )

            const dmErrorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("You have to have your DMs open! All modmail discussions are done through DMs with the Politibot. [See how to open them here](https://www.technobezz.com/how-to-enable-direct-messages-on-discord/) - your settings must be set to 'everyone'");

            const prompt = await interaction.user.send({ embeds: [firstPromptDM], components: [categoryButtons] }).catch(async (err) => {
                console.log(err);
                return interaction.reply({ embeds: [dmErrorEmbed], ephemeral: true });
            });

            interaction.reply({ content: "Check your DMs and proceed there!", ephemeral: true})

            const filter = (i) => {
                return i.user.id === interaction.user.id;
            };

            (await prompt).awaitMessageComponent({ time: 180_000 }).then(async (interaction) => {
                buttonClicked = interaction.customId;

                const secondPrompt = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`You selected **${buttonClicked}**. Now, please give us a reason why you're opening this ticket. Provide us with message links if possible, or as much detail as necessary to help us solve your situation.`)
                .setFooter({ text: 'The bot will only look for messages for 180 seconds before timing out.'});

                const promptModal = new ModalBuilder()
                .setCustomId('promptmodal')
                .setTitle('Reason for Ticket');

                const reasonInput = new TextInputBuilder()
                .setCustomId('reasoninput')
                .setLabel('Give us as much information as possible:')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(2000)
                .setPlaceholder('Type your reason here. This prompt expires in 180 seconds. Do not click off of this prompt.')
                .setRequired(true);

                const modalRow = new ActionRowBuilder().addComponents(reasonInput)

                promptModal.addComponents(modalRow)


                await interaction.showModal(promptModal)

                const reasonGiven = await interaction.awaitModalSubmit({ time: 180_000 }).then(async (interaction) => {

                    const reasonGiven = interaction.fields.getTextInputValue('reasoninput')

                    const finalEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("New Ticket Opened:")
                    .addFields([
                        { name: "Category", value: `${buttonClicked}` },
                        { name: "Reason", value: `${reasonGiven}` }
                    ])
                    .setFooter({ text: "Please be patient and await a response from staff."})
                    .setTimestamp();

                    let mentionVal; // Set up mentions
                    if (buttonClicked === "appeals") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920>"
                    } else if (buttonClicked === "moderation") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139>"
                    } else if (buttonClicked === "botsupport") {
                        mentionVal = "<@178689418415177729>"
                    } else if (buttonClicked === "partnerships") {
                        mentionVal = "<@178689418415177729> <@&927316457233186846>"
                    } else if (buttonClicked === "other") {
                        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139> <@&1013285748012757053> <@&927317020867969074>"
                    }

                    const archivedChannels = await ticketsChannel.threads.fetchArchived({ fetchAll: true })
                    const archivedThreads = await archivedChannels.threads
                    const archivedNums = [];

                    archivedThreads.forEach(element => {
                        archivedNums.push(nameTemp = element.name.split("-")[2])
                    })

                    const claimCloseButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId('claimthread')
                        .setLabel('Claim')
                        .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                        .setCustomId('closethread')
                        .setLabel('Close')
                        .setStyle(ButtonStyle.Danger),
                    );

                    const embedOpen = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("New Ticket Opened")
                    .setAuthor({ name: interaction.user.tag, value: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setFields([
                        { name: "Category", value: buttonClicked },
                        { name: "Reason", value: reasonGiven }
                    ])
                    .setFooter({ text: "Please claim the ticket before proceeding."})

                    console.log(`buttonClicked: ${buttonClicked}`)
                    const tagArray = [];
                    ticketsChannel.availableTags.forEach(element => {
                        if (element.name.toLowerCase() === `${buttonClicked}`) {
                            tagArray.push(element.id)
                        }
                        if (element.name.toLowerCase() === `unclaimed`) {
                            tagArray.push(element.id)
                        }
                    })
                    const chosenTag = tagArray[0]
                    const unclaimedTag = tagArray[1]

                    if (!archivedNums.length) { //If there are no threads, start from 1.
                        ticketsChannel.threads.create({
                            name: `${memberDiscriminator}-1`,
                            autoArchiveDuration: 10080,
                            message: ({ content: mentionVal, embeds: [embedOpen], components: [claimCloseButtons] }),
                            reason: 'User Opened Ticket',
                            appliedTags: [chosenTag, unclaimedTag]
                        })
                    } else if (archivedNums.length > 0) { //If there are threads, +1
                        const currentNum = (Math.max(...archivedNums))

                        ticketsChannel.threads.create({
                            name: `${memberDiscriminator}-${currentNum + 1}`,
                            autoArchiveDuration: 10080,
                            message: ({ content: mentionVal, embeds: [embedOpen], components: [claimCloseButtons] }),
                            reason: 'User Opened Ticket',
                            appliedTags: [chosenTag, unclaimedTag]
                        })
                    }

                    await interaction.reply({ embeds: [finalEmbed] })
                    return prompt.edit({ content: "All done! Ticket Successfully Opened.", embeds: [], components: [] })

                }).catch(error => {
                    console.log(error)
                    return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
                })

            }).catch(error => {
                console.log(error)
                return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
            })

        }

    },
  });
  