const config = require("../config.json");

function TicketCreate(client, ticketName, ticketCat, ticketPreview, ticketButtons, ticketContact, interaction) {
    const ticketChannel = client.guilds.cache.get(config.guildID).channels.cache.get(config.ticketParent);

    let mentionVal; // Set up mentions
    if (ticketCat === "appeals") {
        mentionVal = "<@178689418415177729> <@&927318500614225920>"
    } else if (ticketCat === "moderation" && ticketContact === false) {
        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139>"
    } else if (ticketCat === "moderation" && ticketContact === true) {
        mentionVal = `${interaction.user}`
    } else if (ticketCat === "bot support") {
        mentionVal = "<@178689418415177729>"
    } else if (ticketCat === "partnerships") {
        mentionVal = "<@178689418415177729> <@&927316457233186846>"
    } else if (ticketCat === "other") {
        mentionVal = "<@178689418415177729> <@&927318500614225920> <@&854841000480079882> <@&893189360105689139> <@&927317020867969074>"
    }


    let tagArray = [];
    ticketChannel.availableTags.forEach(element => {
        if (element.name.toLowerCase() === `unclaimed`) {
            tagArray.push(element.id)
        }
        if (element.name.toLowerCase() === `${ticketCat}`) {
            tagArray.push(element.id)
        }
    });
    const chosenTag = tagArray[0]
    const unclaimedTag = tagArray[1]
    ticketChannel.threads.create({
        name: ticketName,
        autoArchiveDuration: 10080,
        message: ({ content: mentionVal, embeds: [ticketPreview], components: [ticketButtons] }),
        reason: 'User Opened Ticket',
        appliedTags: [chosenTag, unclaimedTag]
    })
}

function TicketChecker(client, interaction) {
    const ticketChannel = client.guilds.cache.get(config.guildID).channels.cache.get(config.ticketParent);

    const memberDiscriminator1 = interaction.user.username.replace("#", "-")
    const memberDiscriminator = memberDiscriminator1.replace(" ", "_")
    const discrimLength = memberDiscriminator.length
    let ticketsArray = [];

    if (ticketChannel.threads.cache.find(x => x.name.substring(0, discrimLength) === memberDiscriminator)) { // Found an active thread.
        ticketChannel.threads.cache.forEach(element => {
            if (element.name.substring(0, discrimLength) === memberDiscriminator) {
                    ticketsArray.push(element)
            }
        })

        if (ticketsArray[ticketsArray.length - 1].archived === false) { // Active thread found! Error it out.
            console.log("Active ticket found.")
            return 'true'
        } else {
            console.log("No active ticket found.")
            return 'false'
        }
    }
}

module.exports = {
    TicketCreate: TicketCreate,
    TicketChecker: TicketChecker
}