const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
    PermissionFlagsBits,
  } = require("discord.js");
const xp = require('simply-xp')
  const client = (module.exports = {
    data: new SlashCommandBuilder()
        .setName("xpleaderboard")
        .setDescription("Check out the leaderboard!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        
        const data = await xp.leaderboard(client, interaction.guild.id, 25);

        const ldb = new EmbedBuilder()
            .setTitle("XP Leaderboard")
            .setColor("White")
            .setDescription("We give xp for leveling up based on how much time you spend in VC, how many messages you send, and more! Below is a list of the top 25.")
            .setFooter({ text: "Use /rank to see your individual xp/rank data."})
            .setTimestamp();

        data.forEach((element) => {
            ldb.addFields({ name: `${interaction.guild.members.cache.get(element.userID).displayName}`, value: `**Level:** ${element.level}\n**XP:** ${element.xp}`, inline: true })
        });

        interaction.reply({ embeds: [ldb] })

    },
});
  