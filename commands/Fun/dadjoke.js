const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed, } = require("discord.js");
const fetch = require("node-fetch")
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("dadjoke")
    .setDescription("Get a random dad joke."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        try {
            let response = await fetch(`https://icanhazdadjoke.com/slack`);
            let data = await response.text();
            const img = JSON.parse(data)
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(img.attachments[0].text)
            await interaction.reply({ embeds: [embed]})
        } catch(error) {
            console.log(error)
        }
    },
  });
  