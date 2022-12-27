const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
const xp = require('simply-xp')
  const client = (module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Check a rank!")
        .addUserOption(options => options
            .setName("user")
            .setDescription("Who do you want to see?")
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        const member = interaction.options.getMember("user") || interaction.user;

        const memberRank = xp.rank(interaction, member.id, interaction.guild.id, {
            background: 'https://cdn.discordapp.com/attachments/948001562444300328/1056677697419477042/nMZf4aT.png',
            color: "#096DD1",
            lvlbar: "#FF3FF3",
            lvlbarBg: "#FF7D33",
        })

        interaction.followUp(memberRank)

    },
  });
  