const {
  EmbedBuilder,
  GuildMember,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");
const { execute } = require("./ready");
const moment = require("moment");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    console.log("Member joined!")

    // if (member.username.includes("habokek") || member.nickname.includes("habokek")) {
    //   member.ban()
    //   return
    // }

    const logChannel = member.guild.channels.cache.get("1052353564913172574");
    const modChannel = member.guild.channels.cache.get("1089619416653758564")
    const accountCreated = parseInt(member.user.createdTimestamp / 1000);
    const joinTime = parseInt(member.joinedAt / 1000);
    let riskColor;
    let riskLevel;

    riskLevel = "Fairly Safe";
    riskColor = "Green";

    const monthsAgo = moment().subtract(2, "months").unix();
    const weeksAgo = moment().subtract(2, "weeks").unix();
    const daysAgo = moment().subtract(2, "days").unix();

    if(accountCreated >= monthsAgo) {
      riskColor = "Yellow";
      riskLevel = "Medium";
    }
    if(accountCreated >= weeksAgo) {
      riskColor = "Orange";
      riskLevel = "High";
    }
    if(accountCreated >= daysAgo) {
      riskColor = "Red";
      riskLevel = "Extreme";
    }

    const joinEmbed = new EmbedBuilder()
    .setAuthor({name: `${member.user.username} | ${member.id}`, iconURL: member.displayAvatarURL({dynamic: true}) })
    .setColor(riskColor)
    .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 256}))
    .setDescription([
      `‣ User: ${member.user}`,
      `‣ Account Type: ${member.user.bot ? "Bot" : "User"}`,
      `‣ Risk Level: ${riskLevel}`,
      `\n‣ Account Created: <t:${accountCreated}:D> | <t:${accountCreated}:R>`,
      `‣ Account Joined: <t:${joinTime}:D> | <t:${joinTime}:R>`
    ].join("\n"))
    .addFields({
      name: "Member Count:",
      value: member.guild.memberCount.toString(),
    })
    .setFooter({ text: "Joined"})
    .setTimestamp();

    if(riskLevel == "High" || riskLevel == "Extreme") {
      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(`MemberLogging-Kick-${member.id}`)
        .setLabel("Kick")
        .setStyle(ButtonStyle.Danger),
        // new ButtonBuilder()
        // .setCustomId(`MemberLogging-Ban-${member.id}`)
        // .setLabel("Ban")
        // .setStyle(ButtonStyle.Danger),
      );

      return modChannel.send({ content: "A suspicious account has joined the server. Please evaluate:", 
      embeds: [joinEmbed], 
      components: [buttons]})
      .then(logChannel.send({ embeds: [joinEmbed]}));

    } else return logChannel.send({ embeds: [joinEmbed] });

  },
};
