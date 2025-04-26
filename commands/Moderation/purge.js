const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a select number of messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addNumberOption((options) =>
      options
        .setName("count")
        .setDescription("Provide a number of messages to purge.")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const channel = interaction.channel;
    const count = interaction.options.getNumber("count");

    if (count > 100) {
      return interaction.reply({ ephemeral: true, content: "You can only purge 100 messages at a time." })
    }

    channel
      .bulkDelete(count)
      .then(
        interaction.reply({ content: `Purged ${count.toString()} messages!` })
      )
      .then(channel.send("https://i.imgur.com/SSiOqrl.gif"))
      .catch(interaction.reply("Something went wrong!"));
  },
};
