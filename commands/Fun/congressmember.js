const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed, } = require("discord.js");
const fetch = require("node-fetch")
const config = require("../../config.json");
const currentCongress = config.currentCongress;
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("congressmember")
    .setDescription("look up a member of congress!")
    .addStringOption(options => options
        .setName("last-name")
        .setDescription("Input the last name of the person you're trying to look up.")
        .setRequired(true)
    )
    .addStringOption(options => options
        .setName("chamber")
        .setDescription("Which chamber do they belong in?")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addNumberOption(options => options
        .setName('congress')
        .setDescription('Input the congress number in which they served.')
        .setRequired(false)
    ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
            const choices = ['house', 'senate'];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
      },
    async execute(interaction, client) {
        let chamberChosen;
        let lastnameChosen;
        let congressChosen;
        const chamberChoseninit = interaction.options.getString("chamber");
        const lastnameChoseninit = interaction.options.getString("last-name");
        chamberChosen = `${chamberChoseninit.toLowerCase()}`
        lastnameChosen = `${lastnameChoseninit.charAt(0).toUpperCase()}${lastnameChoseninit.slice(1).toLowerCase()}`

        if (interaction.options.getNumber("congress")) {
            console.log(interaction.options.getNumber("congress"))
            if (chamberChosen === "house") {
                if (interaction.options.getNumber('congress') < 102) {
                    return interaction.reply("Sorry, we don't have data this far back! We only have House data for the 102nd Congress and beyond.")
                } else 
                if (interaction.options.getNumber('congress') > currentCongress) {
                    return interaction.reply(`Sorry, this Congress exists sometime in the future! We are currently in the ${currentCongress}th Congress.`)
                } else {
                    congressChosen = interaction.options.getNumber("congress")
                }
                
            } else if (chamberChosen === "senate") {
                if (interaction.options.getNumber('congress') < 80) {
                    return interaction.reply("Sorry, we don't have data this far back! We only have Senate data for the 80th Congress and beyond.")
                } else
                if (interaction.options.getNumber('congress') > currentCongress) {
                    return interaction.reply(`Sorry, this Congress exists sometime in the future! We are currently in the ${currentCongress}th Congress.`)
                } else {
                    congressChosen = interaction.options.getNumber("congress")
                }
            }
        } else {
            congressChosen = currentCongress.toString()
        }

        const mainURL = `https://api.propublica.org/congress/v1/${congressChosen}/${chamberChosen}/members.json`
        const mainHeader = {
            "X-API-Key": config.proPublicaAPI,
        }

        console.log(mainURL)

        fetch(mainURL, { method : 'GET', headers: mainHeader }).then((res) => {
            return res.json()
        }).then((json) => {
            var chosenMember = json.results[0].members.filter(obj => {
                return obj.last_name.toLowerCase() === lastnameChosen.toLowerCase()
            })
            if (!chosenMember[0]) {
                return interaction.reply("No results were returned. This member does not exist in this Congress, or you made a mistake.")
            }
            chosenMember = chosenMember[0]
            console.log(chosenMember)

            // Let's set up some basic values.
            let memberShortTitle;
            let memberFirstName;
            let memberMiddleInit;
            let memberLastName;
            let memberSuffix;
            let memberDoB;
            let memberState = chosenMember.state
            let memberDistrict;
            let partyColor;
            let memberTwitter;
            let memberURL;
            let memberTotalVotes;
            let memberMissedVotes;
            let memberPartyLinePct;
            let memberMissedVotesPct;

            const dataArray = [];

            if (chosenMember.short_title) {
                memberShortTitle = chosenMember.short_title + ' '
            } else {
                memberShortTitle = " "
            }
            memberFirstName = chosenMember.first_name
            memberLastName = chosenMember.last_name
            if (chosenMember.middle_name) {
                memberMiddleInit = ` ` + chosenMember.middle_name + ' '
            } else {
                memberMiddleInit = " "
            }
            if (chosenMember.suffix) {
                memberSuffix = ' ' + chosenMember.suffix
            } else {
                memberSuffix = " "
            }

            const memberName = memberShortTitle + memberFirstName + memberMiddleInit + memberLastName + memberSuffix

            if (chosenMember.date_of_birth) {
                memberDoB = chosenMember.date_of_birth
                dataArray.push(`Date of Birth: ${memberDoB}`)
            }

            if (chosenMember.party === "R") {
                partyColor = "Red"
                dataArray.push(`Party:  <:gop:886713354574524468> Republican`)
            } else if (chosenMember.party === "D") {
                partyColor = "Blue"
                dataArray.push(`Party:  <:dnc:886713378532360233> Democrat`)
            } else if (chosenMember.party === "I") {
                partyColor = "White"
                dataArray.push(`Party: Independent`)
            } else if (chosenMember.party === "ID") {
                partyColor = "Blue"
                dataArray.push(`Party:  <:dnc:886713378532360233> Independent (Democrat)`)
            } else if (chosenMember.party === "IR") {
                partyColor = "Red"
                dataArray.push(`Party:  <:gop:886713354574524468> Independent (Republican)`)
            } else {
                partyColor = "White"
            }

            if (chosenMember.district) {
                memberDistrict = chosenMember.district
                memberDistrict = memberState + '-' + memberDistrict
                dataArray.push(`District: ${memberDistrict}\n`)
            } else if (!chosenMember.district) {
                dataArray.push(`State: ${chosenMember.state}\n`)
            }

            if (chosenMember.leadership_role) {
                dataArray.push(`Leadership Role: **${chosenMember.leadership_role}**\n`)
            }
            
            if (chosenMember.total_votes && chosenMember.missed_votes && chosenMember.missed_votes_pct) {
                dataArray.push(`This member has seen a total of ` + '`' + `${chosenMember.total_votes.toString()}` + '`' + ` votes and missed ` + '`' + `${chosenMember.missed_votes.toString()}` + '`' + ` (${chosenMember.missed_votes_pct.toString()}%) votes.`)
            }
            if (chosenMember.votes_with_party_pct) {
                dataArray.push(`This member votes with their party ` + '`' + `${chosenMember.votes_with_party_pct.toString()}%` + '`' + ` of the time.`)
            }

            if (chosenMember.twitter_account || chosenMember.url || chosenMember.id) {
                dataArray.push(` `)
            }
            if (chosenMember.id) {
                dataArray.push(`Member ID: ${chosenMember.id}`)
            }
            if (chosenMember.twitter_account) {
                dataArray.push(`[Twitter](https://twitter.com/${chosenMember.twitter_account})`)
            }
            if (chosenMember.url) {
                dataArray.push(`[Website](${chosenMember.url})`)
            }

            const ordinal = (number) => {
                const ordinalRules = new Intl.PluralRules("en", {
                  type: "ordinal"
                });
                const suffixes = {
                  one: "st",
                  two: "nd",
                  few: "rd",
                  other: "th"
                };
                const suffix = suffixes[ordinalRules.select(number)];
                return (number + suffix);
              }
              
              const congressIdent = ordinal(congressChosen)
              
              let thumbURL;
              if (chamberChosen === "house") {
                thumbURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Seal_of_the_United_States_House_of_Representatives.svg/1030px-Seal_of_the_United_States_House_of_Representatives.svg.png"
              } else if (chamberChosen === "senate") {
                thumbURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Seal_of_the_United_States_Senate.svg/1200px-Seal_of_the_United_States_Senate.svg.png"
              }

            // Let's build the embed.
            const memberEmbed = new EmbedBuilder()
                .setColor(partyColor)
                .setThumbnail(thumbURL)
                .setTitle(memberName + `(${congressIdent})`)
                .setFooter({ text: "Data provided by ProPublica", iconURL: "https://play-lh.googleusercontent.com/8C5GNVMjuD0_jHbIsVH0UqJu_G_mpk_KXtclPkg2ZwnyC9fTfWbWGemUtG_siSXOv2s"})
                .setTimestamp();

            interaction.reply({ embeds: [memberEmbed.setDescription(dataArray.join("\n"))] })

        })

    },
  });
  