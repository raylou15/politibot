const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
      .setName("start")
      .setDescription("Lock a channel.")
      .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("Provide a channel!")
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName("lift")
      .setDescription("Lift a lock a channel.")
      .addChannelOption((options) =>
        options
        .setName("channel")
        .setDescription("Provide a channel!")
        .setRequired(true)
      )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");

    if (interaction.options.getSubcommand() === "start") {
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
        SendMessages: false,
      });

      const lockEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔒  Channel Locked")
        .setDescription("This channel has been locked by a Moderator. This is likely so they can review recent conversations — **this is not a green light to continue the discussion in other channels**.")
        .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})

      const lockEmbed2 = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔒  Gag Order")
      .setDescription("A gag order has been implemented by a Moderator. This is likely so they can review recent conversations — **this is not a green light to continue the discussion in other channels**.")
      .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})

      if (channel.id === "1091113539315433592") {
        channel.send({ embeds: [lockEmbed2] })
        interaction.reply({
          content: `${channel} has been locked.`,
          flags: [MessageFlags.Ephemeral],
        });
      } else {
        channel.send({ embeds: [lockEmbed] })
        interaction.reply({
          content: `${channel} has been locked.`,
          flags: [MessageFlags.Ephemeral],
        });
      }
    }

    if (interaction.options.getSubcommand() === "lift") {
      channel.lockPermissions();

      const lockEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("🔓  Channel Unlocked")
      .setDescription("This channel has been unlocked. Please behave, stay civil, and keep in mind our <#775838975755681842> when discussing and debating.")

      channel.send({ embeds: [lockEmbed] });
      interaction.reply({
        content: `${channel} has been unlocked.`,
        flags: [MessageFlags.Ephemeral],
      });
    }

  },
};
