const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    const logChannel = member.guild.channels.cache.get("1052353564913172574");

    const leaveEmbed = new EmbedBuilder()
      .setAuthor({ name: `${member.user.username} | ${member.id}`, iconURL: member.displayAvatarURL({dynamic: true}) })
      .setColor("Red")
      .setTitle("Member left!")
      .addFields({
        name: "Member Count:",
        value: member.guild.memberCount.toString(),
      })
      .setFooter({ text: "user id: " + member.user.id })
      .setTimestamp();

    logChannel.send({ embeds: [leaveEmbed] });
  },
};
