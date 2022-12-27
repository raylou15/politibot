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

        const member = interaction.options.getUser("user") || interaction.user;

        xp.rank(interaction, member.id, interaction.guild.id, {
            background: 'https://i.imgur.com/nMZf4aT.png',
            color: "#096DD1",
            lvlbar: "#FF3FF3",
            lvlbarBg: "#FF7D33",
        }).then(async (img) => {
            return interaction.followUp({ files: [img] })
        }) 
    },
  });
  