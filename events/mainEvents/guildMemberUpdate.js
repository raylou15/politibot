const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");
const customrolesData = require("../../schemas/customroles");
const { findOne } = require("../../schemas/customroles");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const logChannel = oldMember.guild.channels.cache.get("1052422605304512532");
    var logEmbed;
    logEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
        name: newMember.user.username,
        iconURL: newMember.user.displayAvatarURL({dynamic: true}),
      })
      .setFooter({ text: `id: ${newMember.id}` })
      .setTimestamp();

    if (oldMember.pending && !newMember.pending) {
      newMember.roles.add("909988798308433920");
      logEmbed.addFields({
        name: "Member Screening",
        value: "User agreed to rules.",
      });
      dmEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Welcome to Operation Politics!")
        .setDescription(
          "Operation Politics is a small, community-run server that aims to promote two-way, bipartisan dialogue and debate among young people. We strive to build a platform where everyone can share their opinions and work towards finding common ground and common sense solutions to major political questions we face today. \n\nIf you're looking for an active and civil political server and are willing to participate in good faith, you've found your home here!"
        )
        .addFields(
          {
            name: "❗  Be sure to verify!",
            value:
              "Check out <#909995632293449799> and get started with our short verification process!",
          },
          {
            name: "✉️  Permanent Invite Link",
            value: "https://discord.gg/Axa8TXsHXc",
          },
          {
            name: "🤖  Need Technical Support?",
            value:
              "Bot not working? Can't verify? Something else wrong? Check out <#999439440273473657> and open a ticket for help!",
          }
        );
      logChannel.send({ embeds: [logEmbed] });
      newMember.send({ embeds: [dmEmbed] });
    }

    if (oldMember.roles.cache.difference(newMember.roles.cache)) {
      if (
        oldMember.roles.cache.size > newMember.roles.cache.size ||
        oldMember.roles.cache.size < newMember.roles.cache.size
      ) {
        oldMember.roles.cache.forEach((role) => {
          if (!newMember.roles.cache.has(role.id)) {
            logEmbed.addFields({ name: "Role Removed:", value: role.name });
          }
        });
        newMember.roles.cache.forEach((role) => {
          if (!oldMember.roles.cache.has(role.id)) {
            logEmbed.addFields({ name: "Role Added:", value: role.name });
          }
        });
        logChannel.send({ embeds: [logEmbed] });
      }
    }

    if (oldMember.displayName != newMember.displayName) {
      logEmbed.addFields(
        { name: "Old nickname:", value: oldMember.displayName },
        { name: "New nickname:", value: newMember.displayName }
      );
      logChannel.send({ embeds: [logEmbed] });
    }

    // Nitro Perk Manager
    const oldNitroStatus = oldMember.premiumSince;
    const newNitroStatus = newMember.premiumSince;

    if (oldNitroStatus && !newNitroStatus) {
      if (newMember.id === "154381055841927168") {
        return
      }
      const roleProfile = findOne({ UserID: newMember.user.id })
      if (roleProfile) {
        const role = newMember.guild.roles.cache.get(`${roleProfile.RoleID}`)
        role.delete()
        customrolesData.findOneAndDelete({ UserID: newMember.user.id })
        return console.log("Member unboosted, and custom role was deleted.")
      }
    }

    // Server Subscription Perk Manager

  },
};
