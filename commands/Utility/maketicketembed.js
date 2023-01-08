const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
  } = require("discord.js");
  const infractionData = require("../../schemas/infractions");
  const ms = require("ms");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("maketicketembed")
      .setDescription("Creates the button for verification.")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((options) =>
        options
          .setName("channel")
          .setDescription("channel to post buttons in")
          .setRequired(true)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      const targetChannel = interaction.options.getChannel("channel");
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("openaticket")
          .setLabel("Open a Ticket")
          .setEmoji('📩')
          .setStyle(ButtonStyle.Primary),
      );
  
      const buttonembed = new EmbedBuilder()
        .setTitle("Operation Politics Modmail System")
        .setColor("Green")
        .setDescription("If you need to get in touch with staff, the best way to do it and receive a timely response is using our Modmail / ticket system. This allows you contact our whole team, or specific and relevant parts of our team, to get you the best answers as soon as possible.\n\nOf course, be sure to remember there are other ways of contacting staff for moderation issues, such as `/report` and right clicking a message -> Apps -> Report Message.\n\nYour DMs need to be open and able to accept DMs from bots for this to work. **People who abuse this system will be blacklisted from using it.**")
        .setFooter({
          text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━",
        })
        .setThumbnail("https://i.imgur.com/kcdKk1U.png");
  
      interaction.reply({ content: "thanks", ephemeral: true });
      targetChannel.send({ embeds: [buttonembed], components: [buttonRow] });
    },
  };
  