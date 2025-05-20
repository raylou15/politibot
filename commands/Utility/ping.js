const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  MessageFlags
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's ping!"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const msg = await interaction.channel.send("🏓 Pinging...");

    const pingEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setTitle(":signal_strength: Bot Ping")
      .addFields(
        {
          name: "Time",
          value: `${Math.floor(msg.createdAt - interaction.createdAt)}ms`,
          inline: true,
        },
        { name: "API Ping", value: `${client.ws.ping}ms`, inline: true }
      );

    msg.delete();
    await interaction.reply({
      content: "",
      embeds: [pingEmbed],
      flags: [MessageFlags.Ephemeral],
    });
  },
});
