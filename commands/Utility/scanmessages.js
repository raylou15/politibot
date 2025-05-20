const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Embed,
  MessageFlags
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("scanmessages")
    .setDescription("Learn more about the bot and commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(options => options
      .setName("string")
      .setDescription("string to search through")
      .setRequired(true)
    )
    .addUserOption(options => options
      .setName("user")
      .setDescription("user to target")
      .setRequired(true)
    )
  ,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {

    const str = interaction.options.getString("string")
    const user = interaction.options.getUser("user")
    const limit = 100
    const guild = interaction.guild

    await interaction.reply('Searching...');

    let msgsFetched = 0;
    let lastMessageId = null;
    let mentions = [];

    try {
      while (msgsFetched < 100000) {
        const channels = guild.channels.cache.filter(channel => channel.isTextBased());

        for (const [channelId, channel] of channels) {
          let msgsFetched = 0;
          let lastMessageId = null;

          while (msgsFetched < limit) {
            console.log("scanning...")
            // Fetch messages in batches of 100 (Discord's limit per request)
            const fetchedMessages = await channel.messages.fetch({
              limit: Math.min(100, limit - msgsFetched),
              ...(lastMessageId && { before: lastMessageId }),
            }).catch(() => null); // Ignore inaccessible channels

            if (!fetchedMessages || fetchedMessages.size === 0) break; // No more messages to fetch

            fetchedMessages.forEach(msg => {
              if (msg.author.id === user.id && msg.content.includes(str)) {
                mentions.push(`[${channel.name}] [${msg.createdAt}] ${msg.content}`);
                msg.delete()
              }
            });

            msgsFetched += fetchedMessages.size;
            lastMessageId = fetchedMessages.last().id;

            console.log(`Up to ${mentions.length} fetched`)
          }

        }

        if (mentions.length > 0) {
          const response = `Found ${mentions.length} message(s) mentioning "${str}"`
          await interaction.editReply(response);

          console.log(mentions)
        } else {
          await interaction.editReply(`No messages mentioning "${str}" were found.`);
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('An error occurred while searching for messages.');
    }

  },
});
