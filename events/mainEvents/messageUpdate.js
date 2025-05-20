const {
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const messageCreate = require("./messageCreate");
const { execute } = require("./ready");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.content || !newMessage.content) return;

    // === USER DM EDITED (user -> bot DM) ===
    if (!oldMessage.guild) {
      const memberDiscriminator1 = newMessage.author.username.replace("#", "-");
      const memberDiscriminator = memberDiscriminator1.replace(" ", "_");
      const discrimLength = memberDiscriminator.length;
      const ticketsChannel = client.channels.cache.get("1053882820684169266");

      ticketsArray = [];
      if (ticketsChannel.threads.cache.find(x => x.name.substring(0, discrimLength) === memberDiscriminator)) {
        ticketsChannel.threads.cache.forEach(element => {
          if (element.name.substring(0, discrimLength) === memberDiscriminator) {
            ticketsArray.push(element);
          }
        });

        if (ticketsArray[ticketsArray.length - 1].archived === false) {
          const currentChannel = ticketsArray[ticketsArray.length - 1];

          currentChannel.messages.fetch({ limit: 100 }).then(messages => {
            messages.forEach(msg => {
              if (msg.embeds[0] && msg.embeds[0].footer && msg.embeds[0].footer.text.includes(newMessage.id.slice(-8))) {
                let oldmsgContent = msg.embeds[0].fields?.[0]?.value || msg.embeds[0].description;
                let newmsgContent = newMessage.content.length > 0 ? newMessage.content : " ";

                const newEmbed = new EmbedBuilder()
                  .setColor("Yellow")
                  .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
                  .setFields(
                    { name: "Original Message", value: oldmsgContent },
                    { name: "Edited Message", value: newmsgContent }
                  )
                  .setFooter({ text: `User ID: ${newMessage.author.id} • ${newMessage.id.slice(-8)}\n` })
                  .setTimestamp();

                msg.edit({ embeds: [newEmbed] });
              }
            });
          });
        }
      }
    }

    // === STAFF EDITED THREAD MESSAGE (staff -> user DM mirror) ===
    if (oldMessage.guild && oldMessage.channel.isThread?.()) {
      const userIdMatch = oldMessage.channel.name.match(/^([^\-]+)/);
      if (!userIdMatch) return;

      const targetUsernameFragment = userIdMatch[1];
      const user = client.users.cache.find(u =>
        u.username.replace("#", "-").replace(" ", "_").startsWith(targetUsernameFragment)
      );
      if (!user) return;

      try {
        const dmChannel = await user.createDM();
        const dmMessages = await dmChannel.messages.fetch({ limit: 50 });

        dmMessages.forEach(dm => {
          const footerText = dm.embeds?.[0]?.footer?.text || "";
          const matchFragment = oldMessage.id.slice(-8);

          if (footerText.includes(matchFragment)) {
            let staffID = newMessage.author.id.slice(-5);
            let newmsgContent = newMessage.content.length > 0 ? newMessage.content : " ";

            const newEmbed = new EmbedBuilder()
              .setColor("Yellow")
              .setAuthor({
                name: "Operation Politics Staff Team",
                iconURL: newMessage.guild.iconURL()
              })
              .setDescription(`${newmsgContent}`)
              .setFooter({
                text: `Ticket: ${oldMessage.channel.name} • Staff ID: ${staffID} • ${newMessage.id.slice(-8)}`
              })
              .setTimestamp();

            dm.edit({ embeds: [newEmbed] });
          }
        });
      } catch (err) {
        console.error("❌ Failed to update user DM for edited staff message:", err);
      }
    }

    // === STANDARD GUILD MESSAGE EDIT LOGGING ===
    if (oldMessage.webhookId || oldMessage.author?.bot || !oldMessage.channel.guild) return;
    if (oldMessage.content === newMessage.content) return;
    if (oldMessage.content.length && (oldMessage.content.length > 1024 || newMessage.content.length > 1024)) return;

    const msgUpdate = new EmbedBuilder()
      .setAuthor({
        name: newMessage.author.username,
        iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
      })
      .setFooter({ text: `id: ${newMessage.author.id}` })
      .setTimestamp()
      .addFields(
        { name: "Old message:", value: `${oldMessage}` },
        { name: "New message:", value: `${newMessage}` },
        { name: "Channel:", value: `${oldMessage.channel}` }
      )
      .setColor("Blue");

    const logChannel = client.channels.cache.get("1052421938221432852");
    logChannel.send({ embeds: [msgUpdate] }).catch(async (err) => {
      console.log(err);
      logChannel.send("**Old Message:**");
      logChannel.send(oldMessage.content);
      logChannel.send("**New Message:**");
      logChannel.send(newMessage.content);
    });
  },
};
