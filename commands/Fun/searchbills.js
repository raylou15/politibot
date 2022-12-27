const { time, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed, ComponentBuilder, } = require("discord.js");
const fetch = require("node-fetch")
const config = require("../../config.json");
const currentCongress = config.currentCongress;
const client = (module.exports = {
    data: new SlashCommandBuilder()
    .setName("searchbills")
    .setDescription("Search for legislation relating to a specific topic")
    .addSubcommand(subcommand => subcommand
        .setName("general")
        .setDescription("General search for bills with key phrases or words.")
        .addStringOption(options => options
            .setName("query")
            .setDescription("What are you searching for?")
            .setRequired(true)
        ),    
    )
    .addSubcommand(subcommand => subcommand
        .setName("insubject")
        .setDescription("General search for bills with a particular subject.")
        .addStringOption(options => options
            .setName("query")
            .setDescription("What are you searching for?")
            .setRequired(true)
        ),    
    )
    .addSubcommand(subcommand => subcommand
        .setName("subjectfind")
        .setDescription("Find specific subjects!")
        .addStringOption(options => options
            .setName('query')
            .setDescription("What are you searching for?")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("member")
        .setDescription("Get bills by a specific member.")
        .addStringOption(options => options
            .setName("member-id")
            .setDescription("A member's ID. Get this from /congressmember")
            .setRequired(true)    
        )
        .addStringOption(options => options
            .setName("type")
            .setDescription("Type of bill to search for.")
            .setAutocomplete(true)
            .setRequired(true)
        ) 
    )
    .addSubcommand(subcommand => subcommand
        .setName("recent")
        .setDescription("Find the most recent bills. Only works for the current Congress.")
        .addStringOption(options => options
            .setName("chamber-name")
            .setDescription("Which chamber to look into")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("type")
            .setDescription("Type of bill to search for.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("upcoming")
        .setDescription("Find which bills are scheduled to be voted on soon.")
        .addStringOption(options => options
            .setName("chamber")
            .setDescription("Which chamber are we looking for?")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("exact")
        .setDescription("Find information on an exact bill.")
        .addStringOption(options => options
            .setName("id")
            .setDescription("Input the bill's ID. This is usually structured like 'hr3345'.")
            .setRequired(true)
        )
        .addNumberOption(options => options
            .setName('congress')
            .setDescription('OPTIONAL - Defaults to current. The Congress you want to find this bill in.')
            .setRequired(false)
            .setMinValue(105)
            .setMaxValue(currentCongress)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName("help")
        .setDescription("Find out how to use this system!")
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async autocomplete(interaction, client) {
        const focusedOption = interaction.options.getFocused(true)
        let choices;
        if (focusedOption.name === 'chamber') {
            choices = ['house', 'senate']
        }
        if (focusedOption.name === 'chamber-name') {
            choices = ['house', 'senate', 'both']
        }
        if (focusedOption.name === 'type') {
            choices = ['introduced', 'updated', 'active', 'passed', 'enacted', 'vetoed']
        }

        const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'general') {
            const query = interaction.options.getString("query")
            const mainURL = `https://api.propublica.org/congress/v1/bills/search.json?query="${query}"`
            const mainHeader = {
                "X-API-Key": config.proPublicaAPI,
            }

            fetch (mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results[0].bills[0]) {
                    return interaction.reply("No results were found. Please try revising your search.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Bill Search: ${query}`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const first10 = json.results[0].bills.slice(0, 5)

                first10.forEach(element => {
                    const title = element.title
                    const shortitle = title.substring(0, 240)
                    resultsEmbed.addFields({
                        name: `${element.number} - ${shortitle}...`,
                        value: `**Bill ID:** ${element.bill_id}\n**Sponsor:** ${element.sponsor_name} (${element.sponsor_party}-${element.sponsor_state}) (ID: ${element.sponsor_id})\n**Committee:** ${element.committees}\n**Last Action:** ${element.latest_major_action_date} - ${element.latest_major_action}\n[Congress.gov](${element.congressdotgov_url})\n[Govtrack](${element.govtrack_url})\n━━━━━━━━━━━━━━━`
                    })
                })
                resultsEmbed.addFields({
                    name: "Not what you're looking for?",
                    value: "If you couldn't find what you're looking for, we only show the top 5 most recent results " + `(out of ${json.results[0].num_results} total)` + " because of embed limitations. Try refining your search!"
                })

                interaction.reply({ embeds: [resultsEmbed] })

            })

        } else if (interaction.options.getSubcommand() === 'insubject') {
            const query1 = interaction.options.getString("query")
            const query = query1.replace(/\s+/g, '-').toLowerCase();
            const mainURL = `https://api.propublica.org/congress/v1/bills/subjects/${query}.json`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }
            
            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results) {
                    return interaction.reply("No results were found. Please try again. If you need help, run `/searchbills subjects` to find related subjects.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Bill Search: ${query}`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const first10 = json.results.slice(0, 5)

                first10.forEach(element => {
                    const title = element.title
                    const shortitle = title.substring(0, 240)
                    resultsEmbed.addFields({
                        name: `${element.number} - ${shortitle}...`,
                        value: `**Bill ID:** ${element.bill_id}\n**Sponsor:** ${element.sponsor_name} (${element.sponsor_party}-${element.sponsor_state}) (ID: ${element.sponsor_id})\n**Committee:** ${element.committees}\n**Last Action:** ${element.latest_major_action_date} - ${element.latest_major_action}\n[Congress.gov](${element.congressdotgov_url})\n[Govtrack](${element.govtrack_url})\n━━━━━━━━━━━━━━━`
                    })
                })
                resultsEmbed.addFields({
                    name: "Not what you're looking for?",
                    value: "If you couldn't find what you're looking for, we only show the top 5 most recent results " + `(out of ${json.num_results} total)` + " because of embed limitations. Try refining your search!"
                })

                interaction.reply({ embeds: [resultsEmbed] })
            })



        } else if (interaction.options.getSubcommand() === "subjects") {
            const query = interaction.options.getString("query")
            const mainURL = `https://api.propublica.org/congress/v1/bills/subjects/search.json?query=${query}`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }
            
            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results) {
                    return interaction.reply("No results were found. Please try again. Try using a more broad term.")
                }

                if (!json.results[0].subjects[0]) {
                    return interaction.reply("No results were found. Please try again. Try using a more broad term.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Bill Subject Search: ${query}`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const subjectArrays = [];
                json.results[0].subjects.forEach(element => {
                    subjectArrays.push(`‣ ${element.name}`)
                })

                interaction.reply({ embeds: [resultsEmbed.setDescription(subjectArrays.join("\n"))] })

            })



        } else if (interaction.options.getSubcommand() === "member") {
            const memberTarget = interaction.options.getString("member-id")
            const typeChosen = interaction.options.getString("type")

            const mainURL = `https://api.propublica.org/congress/v1/members/${memberTarget}/bills/${typeChosen}.json`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }

            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results[0].bills) {
                    return interaction.reply("No results were found. Please try again. Check your Member ID.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Recent Bills by ${json.results[0].bills[0].sponsor_title} ${json.results[0].name} (${json.results[0].bills[0].sponsor_party}-${json.results[0].bills[0].sponsor_state}) (ID: ${json.results[0].bills[0].sponsor_id})`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const bills = json.results[0].bills.slice(0, 10)
                bills.forEach(element => {
                    let title;
                    if (element.short_title) {
                        title = element.short_title.substring(0, 240)
                    } else {
                        title = element.title.substring(0, 240)
                    }
                    resultsEmbed.addFields({ name: `${element.number} - ${title}`, value: `‣Bill ID: ${element.bill_id}\n‣Introduced: ${element.introduced_date}\n‣Active?: ${element.active}\n‣Committees: ${element.committees}\n‣Topic: ${element.primary_subject}\n\n‣Last Major Action: ${element.latest_major_action_date} - ${element.latest_major_action}\n\n[Congress.gov](${element.congressdotgov_url})\n[Govtrack](${element.govtrack_url})\n━━━━━━━━━━━━━━━` })
                })

                resultsEmbed.addFields({
                    name: "Not what you're looking for?",
                    value: "If you couldn't find what you're looking for, we only show the top 10 most recent results " + `(out of ${json.num_results} total)` + " because of embed limitations."
                })
                
                interaction.reply({ embeds: [resultsEmbed] })

            })


        } else if (interaction.options.getSubcommand() === 'recent') {
            const chamberChosen = interaction.options.getString('chamber-name')
            const typeChosen = interaction.options.getString('type')

            const mainURL = `https://api.propublica.org/congress/v1/${currentCongress}/${chamberChosen}/bills/${typeChosen}.json`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }

            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results[0].bills) {
                    return interaction.reply("No results were found. Please try again. Check your Member ID.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Recent ${typeChosen} bills: (Chamber: ${chamberChosen})`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const first10 = json.results[0].bills.slice(0, 6)

                first10.forEach(element => {
                    const title = element.title
                    const shortitle = title.substring(0, 240)
                    resultsEmbed.addFields({
                        name: `${element.number} - ${shortitle}...`,
                        value: `**Bill ID:** ${element.bill_id}\n**Sponsor:** ${element.sponsor_name} (${element.sponsor_party}-${element.sponsor_state}) (ID: ${element.sponsor_id})\n**Committee:** ${element.committees}\n**Last Action:** ${element.latest_major_action_date} - ${element.latest_major_action}\n[Congress.gov](${element.congressdotgov_url})\n[Govtrack](${element.govtrack_url})\n━━━━━━━━━━━━━━━`
                    })
                })

                resultsEmbed.addFields({
                    name: "Not what you're looking for?",
                    value: "If you couldn't find what you're looking for, we only show the top 6 most recent results " + `(out of ${json.results[0].num_results} total)` + " because of embed limitations."
                })
                
                interaction.reply({ embeds: [resultsEmbed] })

            })


        } else if (interaction.options.getSubcommand() === 'upcoming') {
            const chamberChosen = interaction.options.getString('chamber')

            const mainURL = `https://api.propublica.org/congress/v1/bills/upcoming/${chamberChosen}.json`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }

            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results[0].bills[0]) {
                    return interaction.reply("No results found. There likely are not any scheduled votes happening. Congress may be in recess.")
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle(`Upcoming Votes in the ${chamberChosen}`)
                .setURL(`${json.results[0].bills[0].url}`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                const billsUpcoming = json.results[0].bills

                billsUpcoming.forEach(element => {
                    const title = element.description
                    const shortitle = title.substring(0, 240)
                    const dateSched = time(new Date(element.scheduled_at))
                    resultsEmbed.addFields({
                        name: `${element.bill_number} - ${shortitle}...`,
                        value: `**Bill ID:** ${element.bill_id}\n[Link to Bill](${element.bill_url})\n**Scheduled At:** ${dateSched}\n**Consideration:** ${element.consideration}\n━━━━━━━━━━━━━━━`
                    })
                })

                resultsEmbed.addFields({
                    name: "Not what you're looking for?",
                    value: "If you couldn't find what you're looking for, the bill in question may not be up for a scheduled vote anytime soon. Use our other commands to search for more specific legislation and find updates."
                })
                
                interaction.reply({ embeds: [resultsEmbed] })

            })

        } else if (interaction.options.getSubcommand() === 'exact') {
            const billID = interaction.options.getString('id')
            let congressChosen;
            if (interaction.options.getNumber('congress')) {
                congressChosen = interaction.options.getNumber('congress')
            } else {
                congressChosen = currentCongress
            }

            const mainURL = `https://api.propublica.org/congress/v1/${congressChosen}/bills/${billID}.json`
            const mainHeader = {
                "X-API-Key": "bOa3BIGWU1XLgXenk35nftpOCVpjcM1ESkWktufp",
            }

            fetch(mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                if (!json.results) {
                    interaction.reply("This bill doesn't exist! Follow the correct id format (ex: hr3455) and try again, or try specifying which Congress.")
                }

                const bill = json.results[0]

                let title;
                if (bill.short_title) {
                    title = bill.short_title.substring(0, 240)
                } else {
                    title = bill.title.substring(0, 240)
                }
                let summary;
                if (bill.summary_short) {
                    summary = bill.summary_short
                } else {
                    summary = `${bill.summary(substring(0, 2048))}...`
                }

                const introducedDate = time(new Date(bill.introduced_date))
                const lastMajorAction = time(new Date(bill.latest_major_action_date))

                let thumbURL;
                if (bill.number[0].toLowerCase() === "h") {
                    thumbURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Seal_of_the_United_States_House_of_Representatives.svg/1030px-Seal_of_the_United_States_House_of_Representatives.svg.png"
                } else if (bill.number[0].toLowerCase() === "s") {
                    thumbURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Seal_of_the_United_States_Senate.svg/1200px-Seal_of_the_United_States_Senate.svg.png"
                }

                const resultsEmbed = new EmbedBuilder()
                .setColor("White")
                .setThumbnail(thumbURL)
                .setTitle(`${bill.number} - ${title}`)
                .setURL(`${bill.versions[0].url}`)
                .setDescription(`**Sponsor:** ${bill.sponsor} (${bill.sponsor_party}-${bill.sponsor_state}) (ID: ${bill.sponsor_id}) \n**Primary Subject:** ${bill.primary_subject} \n**Committees:** ${bill.committees} \n**Introduced:** ${introducedDate}\n**Last Major Action:** ${lastMajorAction} - ${bill.latest_major_action} \n\n**Summary:** ${summary}\n\n**Latest Action History:**`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();


                const actions = bill.actions.slice(0, 6)

                actions.forEach(element => {
                    const dateAction = time(new Date(element.datetime))
                    resultsEmbed.addFields({
                        name: `${element.id} - ${element.chamber} - ${element.action_type}`,
                        value: `${dateAction}\n${element.description.substring(0, 128)}`,
                        inline: true
                    })
                })

                resultsEmbed.addFields({
                    name: `Other Information:`,
                    value: `Active?: ${bill.active}\nCosponsors: ${bill.cosponsors} (${bill.cosponsors_by_party.R} R and ${bill.cosponsors_by_party.D} D)\n[Congress.gov](${bill.congressdotgov_url})\n[Govtrack](${bill.govtrack_url})`
                })
                
                interaction.reply({ embeds: [resultsEmbed] })

            })

        } else if (interaction.options.getSubcommand() === 'help') {
            const helpEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle("Congressional Information API")
                .setDescription("You've probably noticed there's a **lot** of commands under `/searchbills` and other commands. This particular help embed will teach you how our searchbills system works and how to make the best use of it. It might be a complicated process, but it's extremely helpful and intuitive for research purposes.")
                .addFields([
                    {
                        name: '/searchbills general',
                        value: 'This allows you to input any phrase, keyword, or term and search for the most recent bills containing that term.',
                        inline: true
                    },
                    {
                        name: '/searchbills upcoming',
                        value: 'This allows you to see the agenda for an upcoming session and see what will be voted on.',
                        inline: true
                    },
                    {
                        name: '/searchbills recent',
                        value: 'This allows you to find the most recent bills under a certain action category. The command is structured as `/searchbills recent {chamber-name} {type}`, where for {chamber-name} you input either "house", "senate", or "both" from the autocomplete options, and for {type} you choose one of the pre-selected options which helps narrow down the query.',
                        inline: false
                    },
                    {
                        name: '/searchbills subjectfind',
                        value: 'This allows you to find various categories and subjects that bills will be categorized under. Use a broad term to search, such as "health".',
                        inline: true
                    },
                    {
                        name: '/searchbills insubject',
                        value: 'This allows you to search for the most recent bills under a subject category (found with `/searchbills subjectfind`).',
                        inline: true
                    },
                    {
                        name: '/searchbills member',
                        value: `This allows you to search for bills proposed by an individual member. It is formatted as ` + '`' + '/searchbills member {member-id} {type}' + '`' + `, where for {member-id} you input the member's ID, and for {type} you select one of the autocomplete options.` +  'The member ID can be found by searching for a member with `/congressmember {last-name} {chamber}` or by finding the ID on any other embed where you see them.',
                        inline: false
                    },
                    {
                        name: '/searchbills exact',
                        value: 'This allows you to pull up an exact bill and some information about it. The command is formatted as `/searchbills exact {id}`, where {id} is the ID of the bill. This is structured similarly to the bill number. For example, `H.R.2045` would have an ID of `hr2045`. You can also optionally use the {congress} field to specify previous Congresses for older bills.',
                        inline: false
                    },
                ])
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

                interaction.reply({ embeds: [helpEmbed], ephemeral: true })
        
            }


    }
})