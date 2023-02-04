const { EmbedBuilder, ChannelType } = require("discord.js");
const { execute } = require("../mainEvents/ready");

module.exports = {
  name: "typingStart",
  async execute(typing, client) {
    const ticketsChannel = client.channels.cache.get("1053882820684169266");
    const server = client.guilds.cache.get("760275642150420520");
    
    if (typing.channel.isDMBased()) {
        const user = typing.user
        const memberDiscriminator1 = user.tag.replace("#", "-")
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
    if (typing.channel.parent.id === "1053882820684169266") {
        const nameArgs = typing.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)
        const targetUserChannel = targetUser.dmChannel
        console.log(targetUser)
        console.log(targetUserChannel)
        return targetUserChannel.sendTyping().catch(async (err) => {
            console.log(err);
            console.log(`Error encountered trying to send a typing notification to ${targetUser.tag}`);
          });
    }
    
  },
};
