const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
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
  const infractionData = require("../../schemas/infractions");
  const ms = require("ms");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("maketicketembed")
      .setDescription("Creates the button for verification.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      ,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const targetChannel = interaction.channel
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("openaticket")
          .setLabel("Open a Ticket")
          .setEmoji('📩')
          .setDisabled(false)
          .setStyle(ButtonStyle.Primary),
      );

      const buttonembed = new EmbedBuilder()
        .setTitle("Operation Politics Modmail System")
        .setColor("Blue")
        .setDescription("If you need to get in touch with staff, the best way to do it and receive a timely response is using our Modmail / ticket system. This allows you contact our whole team, or specific and relevant parts of our team, to get you the best answers as soon as possible.\n\nOf course, be sure to remember there are other ways of contacting staff for moderation issues, such as `/report` and right clicking a message -> Apps -> Report Message.\n\nYour DMs need to be open and able to accept DMs from bots for this to work. **People who abuse this system will be blacklisted from using it.**")
        .setImage("https://i.imgur.com/YB4NVke.png");
      
      const embed2 = new EmbedBuilder()
      .setDescription("-# Note: If you need to use the ticket system for appeals or other matters but the button below is greyed out, run the `/openticket` command in DMs with <@1043691844145512458>.")
  
      interaction.reply({ content: "thanks", ephemeral: true });
      // targetChannel.send({ embeds: [buttonembed], components: [buttonRow] });
      interaction.channel.messages.fetch("1061462760615051334")
      .then(msg => (
        msg.edit({ embeds: [buttonembed, embed2], components: [buttonRow] })
      )).catch(console.error)
    },
  };
  