const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Embed, } = require("discord.js");
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play Rock, Paper, Scissors!")
    .addSubcommand((subcommand) =>
    subcommand
    .setName("rock")
    .setDescription("Play Rock, Paper, Scissors!")
    )
    .addSubcommand((subcommand) =>
    subcommand
    .setName("paper")
    .setDescription("Play Rock, Paper, Scissors!")
    )
    .addSubcommand((subcommand) =>
    subcommand
    .setName("scissors")
    .setDescription("Play Rock, Paper, Scissors!")
    ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        var optionsArray = ['rock', 'paper', 'scissors'];
        const randomOption = optionsArray[Math.floor(Math.random()*optionsArray.length)];

        if (interaction.options.getSubcommand() === 'rock') {
            if (randomOption === "rock") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Rock 🪨\n\nI chose Rock 🪨\n\nWe tied, there's no winner!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
            if (randomOption === "paper") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Rock 🪨\n\nI chose Paper 📄\n\nPaper 📄 beats Rock 🪨, I win!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
            if (randomOption === "scissors") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Rock 🪨\n\nI chose Paper 📄\n\nPaper 📄 beats Rock 🪨, I win!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
        } else if (interaction.options.getSubcommand() === 'paper') {
            if (randomOption === "rock") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Paper 📄\n\nI chose Rock 🪨\n\nPaper 📄 beats Rock 🪨, you win!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
            if (randomOption === "paper") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Paper 📄\n\nI chose Paper 📄\n\nWe tied, there's no winner!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
            if (randomOption === "scissors") {
                const resultEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Paper 📄\n\nI chose Scissors ✂️\n\nScissors ✂️ cuts Paper 📄, I win!")
                .setFooter({ text: 'Try it out with /rps!'});
                return interaction.reply({ embeds: [resultEmbed] })
            }
        } else if (interaction.options.getSubcommand() === 'scissors') {
            if (randomOption === "rock") {
                const resultEmbedc = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Scissors ✂️\n\nI chose Rock 🪨\n\nRock 🪨 beats Scissors ✂️, I win!")
                .setFooter({ text: 'Try it out with /rps!'});
                await interaction.reply({ embeds: [resultEmbedc] })
            }
            if (randomOption === "paper") {
                const resultEmbedb = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Scissors ✂️\n\nI chose Paper 📄\n\nScissors ✂️ cuts Paper 📄, you win!")
                .setFooter({ text: 'Try it out with /rps!'});
                await interaction.reply({ embeds: [resultEmbedb] })
            }
            if (randomOption === "scissors") {
                const resultEmbeda = new EmbedBuilder()
                .setColor("Blue")
                .setDescription("You chose Scissors ✂️\n\nI chose Scissors ✂️\n\nWe tied, there's no winner!")
                .setFooter({ text: 'Try it out with /rps!'});
                await interaction.reply({ embeds: [resultEmbeda] })
            }
        } else {
            return interaction.reply("I don't know how you did that, but that's not an option!")
        }
    },
  });
  