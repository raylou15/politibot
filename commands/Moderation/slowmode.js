const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    Embed,
  } = require("discord.js");
  const ms = require("ms");
  
  const wait = require('node:timers/promises').setTimeout;

  module.exports = {
    data: new SlashCommandBuilder()
      .setName("slowmode")
      .setDescription("Temporarily lock a channel to allow people to cool off.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setDMPermission(false)
      .addIntegerOption(options => options
        .setName("length")
        .setDescription("Length of how long the slowmode will last in seconds. Maximum of 7200 (120 minutes).")
        .setRequired(true)
        .setMaxValue(7200)
      )
      .addIntegerOption(options => options
        .setName("interval")
        .setDescription("Length of time (in seconds) between each message sent. Default is 10 seconds, maximum is 60 seconds.")
        .setMaxValue(60)
        .setMinValue(1)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const channel = interaction.channel

        let interval
        if (interaction.options.getInteger("interval")) {
          interval = interaction.options.getInteger("interval")
        } else {
          interval = 10
        }

        console.log("test")

        channel.setRateLimitPerUser(interval)
        const slowmodeEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("🐌  Temporary Slowmode Enabled")
        .setDescription(`A Moderator has implemented a temporary slowmode. Use this as some encouragement to take your time and think critically about your responses and let some of the frustration and pressure cool off so this conversation can be more productive.`)
        .setFooter({ text: `This slowmode will expire after ${interaction.options.getInteger("length")/60} minutes. Interval is set to ${interval} seconds per message.` })
        channel.send({ embeds: [slowmodeEmbed] })

        interaction.reply({ content: `This channel now has a ${interval} second slowmode enabled for ${interaction.options.getInteger("length")/60} minutes.`, ephemeral: true })

        await wait(interaction.options.getInteger("length") * 1000)

        channel.setRateLimitPerUser(0)
  
    
  
    },
  };
  