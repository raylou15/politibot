const {
    time, ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
  const client = (module.exports = {
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("Check the server's stats."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const server = interaction.guild;
        const memberCount = server.members.cache.size;
        const userCount = server.members.cache.filter(member => !member.user.bot).size;
        const botCount = server.members.cache.filter(member => member.user.bot).size;
        const createdServer = server.createdTimestamp;
        const channelCount = server.channels.cache.size;
        const roleCount = server.roles.cache.size;

        const infoEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Operation Politics Info")
        .setThumbnail(server.iconURL({size: 256}))
        .setDescription(`Servicing **${memberCount}** members with **${channelCount}** channels and **${roleCount}** roles since ${time(new Date(createdServer))}!\n\n${server.description}`)
        .addFields([
            {
                name: 'User Count',
                value: `${userCount}`,
                inline: true
            },
            {
                name: 'Bot Count',
                value: `${botCount}`,
                inline: true
            },
            {
                name: 'Permanent Invite Link',
                value: `https://www.discord.com/Axa8TXsHXc`
            }
        ])
        .setImage(`https://i.imgur.com/nMZf4aT.png`)
        .setFooter({ text: 'Need help with commands or the bot? Use /help for more information!' })
        .setTimestamp();

        interaction.reply({ embeds: [infoEmbed] })

    }
});
  