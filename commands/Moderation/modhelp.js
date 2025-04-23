const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Embed,
} = require("discord.js");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("modhelp")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription("Learn more about the bot and commands"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const commandEmbed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Operation Politibot Moderation Commands")
      .setDescription(
        `</ban:1044082853127917669> - Bans a user. Only available to Moderator+. \n</case view:1044016372268679228> / </case edit:1044016372268679228> / </case delete:1044016372268679228> - Handle individual cases. Editing and deleting cases only available to Moderator+ \n</incident:1044075143187681281> - Logs an incident against a user. This is a quiet log that does not notify the user, and is not considered a major infraction. Useful for noting iffy circumstances. \n </kick:1044080474173231135> - Kicks a user. Restricted to Moderator+. \n</lock:1048021150699106384> - Locks a channel. \n</lockdown:1048024517550804992> - Locks down many channels instantly. \n</mute:1043768695824072714> - Mutes a user temporarily. Use 1s, 1h, 1m, 1d format. Maximum 28d. \n</purge:1048435021008080906> - Purges a select number of messages from a channel. \n</recentlogs:1044417976906043492> - See the 10 most recently-issued logs. \n</unlock:1048022590326837318> - Unlocks a channel that was previously locked. \n</unlockdown:1048033239769546772> - Removes a lockdown on many channels at once. \n</voicemute:1061472392683212860> - Mutes somebody from using voice channels. \n</warn:1044077170269622383> - Warns a user for a rule violation.`
      )
      .setFooter({ text: "━━━━━━━━━━━━━━━━━ ★ ★ ★ ★ ★ ━━━━━━━━━━━━━━━━━" });



    interaction.reply({ embeds: [commandEmbed], ephemeral: true });
  },
});
