const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  ContainerBuilder,
  FileBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ThumbnailBuilder,
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
    
    const container = new ContainerBuilder();
    container.setAccentColor([40, 74, 141])
    const text1 = new TextDisplayBuilder().setContent(
      [
        '### Operation Politics Bot Help & Info',
        'This bot is designed specifically for usage within this server. It contains all moderation functions, as well as some other fun and utility features necessary for our server.',
        `We also have another bot in this server, <@1129826465203101786>, which has more community-oriented features and fun stuff to meme around with.`,
        `-# You can check out the commands for either bot that are available to you through the Applications Menu.`
      ].join('\n\n')
    )
    const text2 = new TextDisplayBuilder().setContent(
      [
        `### Making Suggestions`,
        `Interested in making a suggestion for the server? You can use </suggest:1129836945938329681> with our other community-oriented bot.`
      ].join('\n\n')
    )
    const text3 = new TextDisplayBuilder().setContent(
      [
        `### Moderation Issues & Other Help`,
        `If you're looking to bring something up to the mod team or raise other issues with the bot, simply Open a Ticket!`
      ].join('\n\n')
    )
    const section3button = new ButtonBuilder()
    .setCustomId("openaticket")
    .setLabel("Open a Ticket")
    .setEmoji('📩')
    .setDisabled(false)
    .setStyle(ButtonStyle.Primary)

    const section3 = new SectionBuilder().addTextDisplayComponents(text3).setButtonAccessory(section3button)

    container.addTextDisplayComponents(text1)
    container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));
    container.addTextDisplayComponents(text2)
    container.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Large));
    container.addSectionComponents(section3)



    interaction.reply({ components: [container], flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
  },
});
