const { EmbedBuilder, ChannelType, Attachment } = require("discord.js");
const { execute } = require("../mainEvents/ready");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const ticketsChannel = client.channels.cache.get("1053882820684169266");
    const server = client.guilds.cache.get("760275642150420520");
    const banserver = client.guilds.cache.get("1019116649632256081");
    const user = message.author
    if (!message.guild) {
        if (!message.author.bot) {
            const memberDiscriminator1 = user.username.replace("#", "-")
            const memberDiscriminator = memberDiscriminator1.replace(" ", "_")
            const discrimLength = memberDiscriminator.length

            ticketsArray = [];
            if (ticketsChannel.threads.cache.find(x => x.name.substring(0, discrimLength) === memberDiscriminator)) { // Found an active thread.
                ticketsChannel.threads.cache.forEach(element => {
                    if (element.name.substring(0, discrimLength) === memberDiscriminator) {
                            ticketsArray.push(element)
                    }
                })

                if (ticketsArray[ticketsArray.length - 1].archived === false) { // Active thread found!
                    const currentChannel = ticketsArray[ticketsArray.length - 1]

                    let msgContent = message.content.length > 0 ? message.content : " "

                    const msgEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(msgContent)
                    .setFooter({ text: `User ID: ${message.author.id} • ${message.id.slice(-8)}\n`})
                    .setTimestamp();

                    currentChannel.send({ embeds: [msgEmbed] })
                    if (message.attachments.size > 0) {
                        message.attachments.forEach(attachment => {
                            currentChannel.send(`${attachment.url}`)
                        })
                    } 
                    message.react('<:tickmark:965445812123500665>')

                } else { // No tickets found
                    
                    const openPrompt = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Operation Politics Modmail System")
                    .setDescription("No open tickets were found. Our bot only accepts DMs if you are trying to open a ticket. In order to do this and to clarify your intent to contact Staff, please use the `/openticket` command.")
                    .setFooter({ text: "If this was a mistake, please ignore." })
                    .setTimestamp();

                    message.reply({ embeds: [openPrompt]})

                }
            } else { // There are no active threads!
                const openPrompt = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("Operation Politics Modmail System")
                .setDescription("No open tickets were found. Our bot only accepts DMs if you are trying to open a ticket. In order to do this and to clarify your intent to contact Staff, please use the `/openticket` command.")
                .setFooter({ text: "If this was a mistake, please ignore." })
                .setTimestamp();

                message.reply({ embeds: [openPrompt]})

            }
        } else return
    }  else if (message.channel.parent === ticketsChannel && !message.author.bot) { // Reply functionality.
        const nameArgs = message.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")

        const banmembers = banserver.members.fetch()
        
        await banmembers

        // Unholy redundancy because discord is fucking stupid
        let targetUser;
        if (client.users.cache.find(u => u.username === targetDiscrim)) {
            targetUser = client.users.cache.find(u => u.username === targetDiscrim)

        } else if (client.users.cache.find(u => u.username === nameArgs[0])) {
            targetUser = client.users.cache.find(u => u.username === nameArgs[0])

        } else {
            const pinmsg = await message.channel.messages.fetchPinned()
            const message = pinmsg.first()
            const embed = message.embeds[0]
            const regex = /<@(\d+)>/;
            const userIDmatch = embed.description.match(regex);

            if (banserver.members.fetch(m => m.user.username === targetDiscrim)) {
                const targetMember = banserver.members.fetch(m => m.user.username === targetDiscrim)
                targetUser = await targetMember.user
    
            } else if (banserver.members.fetch(m => m.user.username === nameArgs[0])) {
                const targetMember = banserver.members.fetch(m => m.user.username === nameArgs[0])
                targetUser = await targetMember.user
    
            } else if (client.users.cache.find(u => u.id === userIDmatch[0])) { 
                targetUser = client.users.cache.find(u => u.id === userIDmatch[0])
    
            } else if (banserver.members.fetch(userIDmatch[0])) {
                const targetMember = banserver.members.fetch(userIDmatch[0])
                targetUser = await targetMember.user
    
            }
        }

        await targetUser
        let staffID = message.author.id.slice(-5) // Setting up aliases for staff.

        const tagID = message.channel.appliedTags[0]
        const tagArray = [];
        message.channel.parent.availableTags.forEach(element => {
            if (element.id === tagID) {
                tagArray.push(element)
            }
        })
        let chosenTag;
        if (tagArray[0]) {
            chosenTag = tagArray[0]
        } else {
            chosenTag = "Other"
        }

        let msgContent = message.content.length > 0 ? message.content : " "
       
        const msgEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: "Operation Politics Staff Team", iconURL: message.guild.iconURL() })
        .setDescription(`${msgContent}`)
        .setFooter({ text: `Ticket: ${message.channel.name} • Staff ID: ${staffID}` })
        .setTimestamp();

        targetUser.send({ embeds: [msgEmbed] }).catch(async (err) => {
            console.log(err);
            message.react('<:crossmark:965445798630416434>')
            return logChannel.send({
                content:
                "I couldn't DM this user since they do not accept DMs from server bots/members. It's recommended that you close this ticket now.",
            });
        });
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                targetUser.send(`${attachment.url}`).catch(async (err) => {
                    console.log(err);
                    message.react('<:crossmark:965445798630416434>')
                    return logChannel.send({
                        content:
                        "I couldn't DM this user since they do not accept DMs from server bots/members. It's recommended that you close this ticket now.",
                    });
                })
            })
        } 

        message.react('<:tickmark:965445812123500665>')

    } else return
  },
};
