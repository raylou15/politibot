const { EmbedBuilder, Colors } = require("discord.js");
const customrolesData = require("../../schemas/customroles");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const logChannel = oldMember.guild.channels.cache.get("1052422605304512532");
    if (!logChannel) return;

    const logEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({
        name: newMember.user?.username ?? "unknown",
        iconURL: newMember.user?.displayAvatarURL?.({ dynamic: true }),
      })
      .setFooter({ text: `id: ${newMember.id}` })
      .setTimestamp();

    // Member finished screening
    if (oldMember.pending && !newMember.pending) {
      try { await newMember.roles.add("909988798308433920"); } catch {}
      const dmEmbed = new EmbedBuilder()
        .setColor(Colors.White)
        .setTitle("Welcome to Operation Politics!")
        .setDescription(
          "Operation Politics is a small, community-run server that aims to promote two-way, bipartisan dialogue and debate among young people. We strive to build a platform where everyone can share their opinions and work towards finding common ground and common sense solutions to major political questions we face today.\n\nIf you're looking for an active and civil political server and are willing to participate in good faith, you've found your home here!"
        )
        .addFields(
          {
            name: "❗  Be sure to verify!",
            value: "Check out <#909995632293449799> and get started with our short verification process!",
          },
          {
            name: "✉️  Permanent Invite Link",
            value: "https://discord.gg/Axa8TXsHXc",
          },
          {
            name: "🤖  Need Technical Support?",
            value: "Bot not working? Can't verify? Something else wrong? Check out <#999439440273473657> and open a ticket for help!",
          },
        );

      try { await logChannel.send({ embeds: [logEmbed.setFields({ name: "Member Screening", value: "User agreed to rules." })] }); } catch {}
      try { await newMember.send({ embeds: [dmEmbed] }); } catch {}
    }

    // Roles changed
    const rolesRemoved = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
    const rolesAdded = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    if (rolesRemoved.size || rolesAdded.size) {
      const fields = [];
      rolesRemoved.forEach(role => fields.push({ name: "Role Removed:", value: role.name || "(unknown)" }));
      rolesAdded.forEach(role => fields.push({ name: "Role Added:", value: role.name || "(unknown)" }));
      if (fields.length) {
        try { await logChannel.send({ embeds: [logEmbed.setFields(fields)] }); } catch {}
      }
    }

    // Nickname changed
    if (oldMember.displayName !== newMember.displayName) {
      const oldNick = oldMember.displayName || "(none)";
      const newNick = newMember.displayName || "(none)";
      try {
        await logChannel.send({
          embeds: [logEmbed.setFields(
            { name: "Old nickname:", value: oldNick },
            { name: "New nickname:", value: newNick },
          )],
        });
      } catch {}
    }

    // Nitro Perk Manager (custom role cleanup on unboost)
    const oldNitroStatus = oldMember.premiumSince;
    const newNitroStatus = newMember.premiumSince;
    if (oldNitroStatus && !newNitroStatus) {
      if (newMember.id === "154381055841927168") return;
      try {
        const roleProfile = await customrolesData.findOne({ UserID: newMember.user.id }).lean();
        if (roleProfile?.RoleID) {
          const role = newMember.guild.roles.cache.get(String(roleProfile.RoleID));
          if (role) await role.delete().catch(() => {});
          await customrolesData.findOneAndDelete({ UserID: newMember.user.id });
          console.log("Member unboosted, and custom role was deleted.");
        }
      } catch (e) {
        console.log("Custom role cleanup failed:", e);
      }
    }
  },
};
