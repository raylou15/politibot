const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn more about the bot and commands"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const commandEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Operation Politibot Help & Info")
      .setDescription(
        "Below is a list of all of your commands and how to use them! If you'd like more info, press `FAQ` below, or make a suggestion with `/suggest`!"
      )
      .setFooter({ text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━" });

    const commandList = client.commands;
    commandList.forEach((element) => {
      commandEmbed.addFields({
        name: `/${element.data.name}`,
        value: `${element.data.description}`,
      });
    });
    interaction.reply({ embeds: [commandEmbed], ephemeral: true });
  },
});
