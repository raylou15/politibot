const { EmbedBuilder, MessageFlags } = require("discord.js");
const messageCreate = require("./messageCreate");
const { execute } = require("./ready");

function safeUsername(user) {
  // Prefer username; fall back to globalName or ID
  const base = (user?.username ?? user?.globalName ?? user?.id ?? "unknown").toString();
  // Only replace on strings; guard even further
  const sanitized = typeof base === "string" ? base : String(base);
  return sanitized.replace("#", "-").replace(/ /g, "_");
}

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    // Basic guards for partials or non-text edits
    if (!newMessage) return;
    if (!oldMessage?.content || !newMessage?.content) return;

    // === USER DM EDITED (user -> bot DM) ===
    if (!oldMessage.guild) {
      // Extra guards
      if (!newMessage.author) return;

      const memberDiscriminator = safeUsername(newMessage.author);
      const discrimLength = memberDiscriminator.length;

      const ticketsChannel = client.channels?.cache?.get("1053882820684169266");
      if (!ticketsChannel?.threads?.cache?.size) return;

      const ticketsArray = [];
      try {
        // Find all matching threads for this user header
        ticketsChannel.threads.cache.forEach(t => {
          const nameFrag = t?.name?.substring(0, discrimLength);
          if (nameFrag && nameFrag === memberDiscriminator) ticketsArray.push(t);
        });
      } catch {
        // If anything odd with cache, bail safely
        return;
      }
      if (!ticketsArray.length) return;

      const currentChannel = ticketsArray[ticketsArray.length - 1];
      if (!currentChannel || currentChannel.archived) return;

      try {
        const messages = await currentChannel.messages.fetch({ limit: 100 });
        messages.forEach(msg => {
          const foot = msg.embeds?.[0]?.footer?.text;
          if (!foot) return;

          if (foot.includes(newMessage.id.slice(-8))) {
            const oldmsgContent = msg.embeds?.[0]?.fields?.[0]?.value ?? msg.embeds?.[0]?.description ?? "(no content)";
            const newmsgContent = newMessage.content.length > 0 ? newMessage.content : " ";

            const newEmbed = new EmbedBuilder()
              .setColor("Yellow")
              .setAuthor({
                name: safeUsername(newMessage.author),
                iconURL: newMessage.author.displayAvatarURL?.({ dynamic: true })
              })
              .setFields(
                { name: "Original Message", value: oldmsgContent.slice(0, 1024) },
                { name: "Edited Message", value: newmsgContent.slice(0, 1024) }
              )
              .setFooter({ text: `User ID: ${newMessage.author.id} • ${newMessage.id.slice(-8)}\n` })
              .setTimestamp();

            msg.edit({ embeds: [newEmbed] }).catch(() => {});
          }
        });
      } catch (err) {
        console.error("❌ Failed to update DM mirror on edit:", err);
      }
    }

    // === STAFF EDITED THREAD MESSAGE (staff -> user DM mirror) ===
    if (oldMessage.guild && oldMessage.channel?.isThread?.()) {
      const name = oldMessage.channel?.name ?? "";
      const userIdMatch = name.match(/^([^\-]+)/);
      if (!userIdMatch) return;

      const targetUsernameFragment = userIdMatch[1];

      // Find a cached user with a username starting with the fragment, but guard for missing usernames
      const user = client.users.cache.find(u => {
        const su = safeUsername(u);
        return typeof su === "string" && su.startsWith(targetUsernameFragment);
      });
      if (!user) return;

      try {
        const dmChannel = await user.createDM();
        const dmMessages = await dmChannel.messages.fetch({ limit: 50 });
        const matchFragment = oldMessage.id.slice(-8);

        dmMessages.forEach(dm => {
          const footerText = dm.embeds?.[0]?.footer?.text || "";
          if (!footerText.includes(matchFragment)) return;

          const staffID = newMessage.author?.id ? newMessage.author.id.slice(-5) : "staff";
          const newmsgContent = newMessage.content.length > 0 ? newMessage.content : " ";

          const newEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({
              name: "Operation Politics Staff Team",
              iconURL: newMessage.guild?.iconURL?.() ?? undefined
            })
            .setDescription(newmsgContent.slice(0, 4096))
            .setFooter({
              text: `Ticket: ${oldMessage.channel.name} • Staff ID: ${staffID} • ${newMessage.id.slice(-8)}`
            })
            .setTimestamp();

          dm.edit({ embeds: [newEmbed] }).catch(() => {});
        });
      } catch (err) {
        console.error("❌ Failed to update user DM for edited staff message:", err);
      }
    }

    // === STANDARD GUILD MESSAGE EDIT LOGGING ===
    // Skip webhooks/bots/DMs/non-text or unchanged
    if (oldMessage.webhookId || oldMessage.author?.bot) return;
    if (!oldMessage.channel?.guild) return;
    if (oldMessage.content === newMessage.content) return;

    // Skip massive messages to keep embed fields valid
    if (oldMessage.content?.length > 1024 || newMessage.content?.length > 1024) return;

    const authorName = safeUsername(newMessage.author);
    const authorIcon = newMessage.author?.displayAvatarURL?.({ dynamic: true });

    const msgUpdate = new EmbedBuilder()
      .setAuthor({ name: authorName, iconURL: authorIcon })
      .setFooter({ text: `id: ${newMessage.author?.id ?? "unknown"}` })
      .setTimestamp()
      .addFields(
        { name: "Old message:", value: oldMessage.content || "(no content)" },
        { name: "New message:", value: newMessage.content || "(no content)" },
        { name: "Channel:", value: oldMessage.channel?.id ? `<#${oldMessage.channel.id}>` : "(unknown)" }
      )
      .setColor("Blue");

    const logChannel = client.channels?.cache?.get("1052421938221432852");
    if (!logChannel) return;

    try {
      await logChannel.send({ embeds: [msgUpdate] });
    } catch (err) {
      console.log(err);
      // Fallback plaintext
      try {
        await logChannel.send("**Old Message:**");
        if (oldMessage.content) await logChannel.send(oldMessage.content);
        await logChannel.send("**New Message:**");
        if (newMessage.content) await logChannel.send(newMessage.content);
      } catch {}
    }
  },
};
