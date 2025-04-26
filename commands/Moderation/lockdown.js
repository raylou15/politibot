const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Locks a bunch of channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand
      .setName("start")
      .setDescription("Start a lockdown in the server")
    )
    .addSubcommand(subcommand => subcommand
      .setName("lift")
      .setDescription("Lift a lockdown in the server")
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {

    const lockEmbed = new EmbedBuilder()
    .setColor("DarkRed")
    .setTitle("🚨  Lockdown Initiated")
    .setDescription("This channel has been locked by a Moderator **in a lockdown.** This usually means there has been a trend of out-of-control behavior in the server, or toxic conversations spilling over to other channels once a channel has been locked, or various other reasons. \n\n Please be patient. Some channels are still available for casual usage, and have intentionally not been locked.")
    .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})

    const unlockEmbed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("🚨  Lockdown Lifted")
    .setDescription("The lockdown has been lifted. Please behave, stay civil, and keep in mind our <#775838975755681842> when discussing and debating.")
    .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})

    const discCat = await interaction.guild.channels.fetch(
      "760275642150420521"
    );
    const commCat = await interaction.guild.channels.fetch(
      "775559863522164737"
    );

    if (interaction.options.getSubcommand() === "start") {
      discCat.children.cache.forEach(channel => {
        if (channel.id !== "1018396794834661508" && channel.id !== "965271666684985454" && channel.id !== "760548421790203934") {
          channel.send({ embeds: [lockEmbed] })
        }
      })
      commCat.children.cache.forEach(channel => {
        if (channel.id !== "1018396794834661508" && channel.id !== "965271666684985454" && channel.id !== "760548421790203934") {
          channel.send({ embeds: [lockEmbed] })
        }
      })
  
      await discCat.permissionOverwrites.create(discCat.guild.roles.everyone, {
        SendMessages: false,
      });
      await commCat.permissionOverwrites.create(commCat.guild.roles.everyone, {
        SendMessages: false,
      });
  
      interaction.reply({ content: "Lockdown successful!", ephemeral: true });
    }

    if (interaction.options.getSubcommand() === "lift") {
      await discCat.permissionOverwrites.create(discCat.guild.roles.everyone, {
        SendMessages: null,
      });
      await commCat.permissionOverwrites.create(commCat.guild.roles.everyone, {
        SendMessages: null,
      });
  
      discCat.children.cache.forEach(channel => {
        if (channel.id !== "1018396794834661508" && channel.id !== "965271666684985454" && channel.id !== "760548421790203934") {
          channel.send({ embeds: [unlockEmbed] })
        }
      })
      commCat.children.cache.forEach(channel => {
        if (channel.id !== "1018396794834661508" && channel.id !== "965271666684985454" && channel.id !== "760548421790203934") {
          channel.send({ embeds: [unlockEmbed] })
        }
      })
  
      interaction.reply({ content: "Unlockdown successful!", ephemeral: true });
    }
  },
};
