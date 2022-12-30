const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");

module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    if (message.channel.guild && message.author) {
      var msgDelete = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.avatarURL(),
      })
      .setFooter({ text: `id: ` + message.author.id })
      .setTimestamp()
      .setFields(
        {
          name: "Message deleted:",
          value: `${message.content || "(no content)"}`,
        },
        { name: `Channel:`, value: `${message.channel}` }
      )
      .setColor("Blue");

    message.guild.channels.cache
      .get("1052421938221432852")
      .send({
        embeds: [msgDelete],
      })
      .catch(async (err) => {
        console.log(err);
        var msgDelete = new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.avatarURL(),
          })
          .setFooter({ text: `id: ` + message.author.id })
          .setTimestamp()
          .setFields(
            {
              name: "Message deleted:",
              value: `The message content was too large to be logged in an embed, so I'm forwarding it below.`,
            },
            { name: `Channel:`, value: `${message.channel}` }
          )
          .setColor("Blue");

        message.guild.channels.cache.get(client.config.messageDeleteLog).send({
          embeds: [msgDelete],
        });
        message.guild.channels.cache
          .get(client.config.messageDeleteLog)
          .send(message.content);
      });
    } else {
      return
    }
  },
};
