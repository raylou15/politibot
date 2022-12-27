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

        await interaction.deferReply()

        xp.rank(interaction, interaction.options.getUser("user")?.id || user.id, guild.id, {
            background: verifyPic(interaction.options.getString("background")) ? interaction.options.getString("background") : null,
            lvlbarBg: interaction.options.getString("lvlbarbg") || null,
            lvlbar: interaction.options.getString("lvlbar") || null,
            color: interaction.options.getString("color") || null,
        }).then((res) => {
            interaction.editReply({
                embeds: [{
                    title: "Result of Function",
                    description: "VIEW RANK IN THE ATTACHMENT",
                    image: { url: "attachment://rank.png" }
                }], files: [res]
            })
        }).catch((err) => {
            interaction.editReply({
                embeds: [{
                    title: "Result of Function",
                    description: err.toString().substring(0, 1024),
                    color: "RED"
                }]
            })
        })

        
    },
  });
  