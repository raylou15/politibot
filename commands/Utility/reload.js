const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");
const { loadCommands, loadComponents } = require("../../handlers/handler");
const { loadEvents } = require("../../handlers/handler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads the bot's files.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options.setName("events").setDescription("Reload your events")
    )
    .addSubcommand((options) =>
      options.setName("commands").setDescription("Reload your commands")
    )
    .addSubcommand((options) =>
      options.setName("buttons").setDescription("Reload your buttons")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events)
            client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply({ content: "🔄 Reloaded Events", ephemeral: true });
        }
        break;
      case "commands":
        {
          loadCommands(client);
          interaction.reply({
            content: "🔄 Reloaded Commands",
            ephemeral: true,
          });
        }
        break;
      case "buttons": {
        loadComponents(client);
        interaction.reply({
          content: "🔄 Reloaded Buttons",
          ephemeral: true,
        });
      }
    }
  },
};
