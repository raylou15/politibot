const { EmbedBuilder } = require("discord.js");
const messageCreate = require("./messageCreate");
const { execute } = require("./ready");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (oldMessage.webhookId || oldMessage.author?.bot || !oldMessage.channel.guild) {
      return
    } else {
      if (oldMessage.content === newMessage.content) return;

      var msgUpdate = new EmbedBuilder()
        .setAuthor({
          name: newMessage.author.tag,
          iconURL: newMessage.author.avatarURL(),
        })
        .setFooter({ text: `id: ` + newMessage.author.id })
        .setTimestamp()
        .addFields(
          { name: "Old message:", value: `${oldMessage}` },
          { name: "New message:", value: `${newMessage}` },
          { name: "Channel:", value: `${oldMessage.channel}` }
        )
        .setColor("Blue");

      const logChannel =
        client.channels.cache.get("1052421938221432852");

      logChannel.send({ embeds: [msgUpdate] }).catch(async (err) => {
        console.log(err);
        var msgUpdate = new MessageEmbed()
          .setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
          .setFooter(`id: ` + newMessage.author.id)
          .setTimestamp()
          .addField(
            "Message edited:",
            `The message content was too large to be logged in an embed, so I'm forwarding it below.`
          )
          .addField(`Channel:`, `${oldMessage.channel}`)
          .setColor("Blue");

        client.channels.cache.get(logChannel).send({
          embeds: [msgUpdate],
        });
        logChannel.send("**Old Message:**");
        logChannel.send(oldMessage.content);
        logChannel.send("**New Message:**");
        logChannel.send(newMessage.content);
      });
    }
  },
};
