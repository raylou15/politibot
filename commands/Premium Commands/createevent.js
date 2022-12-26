const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventStatus,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createevent")
    .setDescription("PREMIUM - Create your own event!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("name")
        .setDescription("What's your event name?")
        .setRequired(true)
    )
    .addNumberOption((options) =>
      options
        .setName("date")
        .setDescription(
          "Input a timestamp! Use [/event help] for more information!"
        )
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("description")
        .setDescription("Choose a description for your event.")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("image")
        .setDescription("OPTIONAL - Provide an image link/thumbnail")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (
      interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
      interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
      interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
      interaction.member.roles.cache.some(role => role.id === "995526730473275423") || // Ko-fi Representative
      interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
      interaction.member.roles.cache.some(role => role.id === "1055374176518680647") || // Senator
      interaction.member.roles.cache.some(role => role.id === "1055374052803493973") // Representative
      ) {
        const eventName = interaction.options.getString("name");
        const eventDate = new Date(interaction.options.getNumber("date"));
        const eventDescription = interaction.options.getString("description");
        const eventChannel =
          interaction.guild.channels.cache.get("931758978952757258");

        let eventThumbnail = interaction.options.getString("image");

        if (!eventThumbnail) {
          eventThumbnail =
            "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png";
        }

        interaction.reply(
          `Name: ${eventName}\nDate: ${eventDate.toString()}\nDescription: ${eventDescription}\nImage: ${eventThumbnail}`
        );

        interaction.guild.scheduledEvents
          .create({
            name: `${interaction.user.username}: ${eventName}`,
            scheduledStartTime: eventDate,
            description: eventDescription,
            entityType: GuildScheduledEventEntityType.StageInstance,
            channel: eventChannel,
            image: eventThumbnail,
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            creator: interaction.member,
            status: GuildScheduledEventStatus.Scheduled,
          }).then(interaction.channel.send("Event created!"));
      }
  },
};
