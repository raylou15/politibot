const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed, } = require("discord.js");
const fetch = require("node-fetch")
const config = require("../../config.json")
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("funfact")
    .setDescription("Get a random fun fact."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        try {
            const mainURL = `https://api.api-ninjas.com/v1/facts?limit=1`
            const mainHeader = {
                "X-API-Key": config.funfactAPI,
            }
            
            fetch (mainURL, { method: "GET", headers: mainHeader }).then((res) => {
                return res.json()
            }).then((json) => {
                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(json[0].fact);

                interaction.reply({ embeds: [embed]})

            });
        } catch(error) {
            console.log(error)
        }
    },
  });
  