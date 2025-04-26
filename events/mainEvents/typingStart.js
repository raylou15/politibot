const { EmbedBuilder, ChannelType } = require("discord.js");
const { execute } = require("../mainEvents/ready");

module.exports = {
  name: "typingStart",
  async execute(typing, client) {
    const ticketsChannel = client.channels.cache.get("1053882820684169266");
    const server = client.guilds.cache.get("760275642150420520");
    const banserver = client.guilds.cache.get("1019116649632256081");
    
    if (typing.channel.isDMBased()) {
        const user = typing.user
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
                return currentChannel.sendTyping()
            }
        }
    }
    if ((typing.channel.parent) && (typing.channel.parent.id === "1053882820684169266") && (!typing.user.bot)) {
        const nameArgs = typing.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")

        const pinmsg = await typing.channel.messages.fetchPinned()
        const message = pinmsg.first()

        const banmembers = banserver.members.fetch()
        
        await banmembers

        // Unholy redundancy because discord is fucking stupid
        let targetUser;
        if (client.users.cache.find(u => u.username === targetDiscrim)) {
            targetUser = client.users.cache.find(u => u.username === targetDiscrim)

        } else if (client.users.cache.find(u => u.username === nameArgs[0])) {
            targetUser = client.users.cache.find(u => u.username === nameArgs[0])

        } else {
            const pinmsg = await typing.channel.messages.fetchPinned()
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

        const targetUserChannel = await targetUser.createDM()
        return targetUserChannel.sendTyping().catch(async (err) => {
            console.log(err);
            console.log(`Error encountered trying to send a typing notification to ${targetUser.username}`);
          });
    }
    
  },
};
