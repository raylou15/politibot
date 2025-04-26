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
      .setName("timeout")
      .setDescription("Temporarily lock a channel to allow people to cool off.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setDMPermission(false)
      .addIntegerOption(options => options
        .setName("length")
        .setDescription("Length of timeout in seconds. Maximum of 300 (5 minutes). Default is 120.")
        .setMaxValue(300)
      )
      .addIntegerOption(options => options
        .setName("slowmode")
        .setDescription("Length in seconds of a slowmode after the channel is unlocked. Maximum of 1800 (30 minutes).")
        .setMaxValue(1800)
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const channel = interaction.channel
      
        channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
          SendMessages: false,
        });

        let timeoutLength = 120
        if (interaction.options.getInteger("length") <= 300 && interaction.options.getInteger("length") > 0) {
            timeoutLength = interaction.options.getInteger("length")
        }
  
        const lockEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("⏲️  Channel Timeout")
          .setDescription("This channel has been put under a `" + `${timeoutLength} second` + "` timeout by a Moderator. This is to allow the chat to cool off, and allow everyone to back off and collect their thoughts before resuming. **This is not a green light to continue the discussion in other channels**")
          .addFields(
            {
                name: "📝  Remember to keep in mind the rules",
                value: "Sometimes conversations can get a little heated or too fast-paced. Dogpiling can occur, as well as frustration and fast-paced discussions that don't make for productive debate. Keep in mind Rules 1, 2, and 13 at all times, and do your best to participate meaningfully and effectively and productively. \n\nIf you feel yourself getting frustrated, don't be afraid to slow down the pace of the conversation, or step away."
            }
          )
          .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})
  

        const msg = await channel.send({ embeds: [lockEmbed] })
        interaction.reply({
        content: `${channel} has been put under a 120 second timeout.`,
        ephemeral: true,
        });

        

        await wait(timeoutLength * 1000)



        const unlockEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("⏲️  Channel Timeout")
        .setDescription("This channel timeout has been lifted! Feel free to resume discussion.")
        .addFields(
            {
                name: "📝  Remember to keep in mind the rules",
                value: "Sometimes conversations can get a little heated or too fast-paced. Dogpiling can occur, as well as frustration and fast-paced discussions that don't make for productive debate. Keep in mind Rules 1, 2, and 13 at all times, and do your best to participate meaningfully and effectively and productively. \n\nIf you feel yourself getting frustrated, don't be afraid to slow down the pace of the conversation, or step away."
            }
          )
        .setFooter({ text: "If you have concerns, you are encouraged to use /openticket and speak with us."})

        await msg.edit({ embeds: [unlockEmbed] })
        channel.lockPermissions();

        if (interaction.options.getInteger("slowmode") <= 1800 && interaction.options.getInteger("slowmode") > 0) {
            msg.channel.setRateLimitPerUser(10)
            const slowmodeEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("🐌  Temporary Slowmode Enabled")
            .setDescription("Now that the channel timeout is over, a temporary slowmode has been implemented. Use this as some encouragement to take your time and think critically about your responses and let some of the frustration and pressure cool off so this conversation can be more productive.")
            .setFooter({ text: `This slowmode will expire after ${interaction.options.getInteger("slowmode")} seconds.` })
            msg.channel.send({ embeds: [slowmodeEmbed] })

            await wait(interaction.options.getInteger("slowmode") * 1000)

            msg.channel.setRateLimitPerUser(0)
        }
  
    
  
    },
  };
  