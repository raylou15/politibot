const { EmbedBuilder } = require("discord.js");
const messageCreate = require("./messageCreate");
const { execute } = require("./ready");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.content || !newMessage.content) {
      return
    }

    if (!oldMessage.guild) {
      const memberDiscriminator1 = newMessage.author.username.replace("#", "-")
      const memberDiscriminator = memberDiscriminator1.replace(" ", "_")
      const discrimLength = memberDiscriminator.length
      const ticketsChannel = client.channels.cache.get("1053882820684169266");

      ticketsArray = [];
      if (ticketsChannel.threads.cache.find(x => x.name.substring(0, discrimLength) === memberDiscriminator)) { // Found an active thread.
        ticketsChannel.threads.cache.forEach(element => {
          if (element.name.substring(0, discrimLength) === memberDiscriminator) {
            ticketsArray.push(element)
          }
        })

        if (ticketsArray[ticketsArray.length - 1].archived === false) { // Active thread found!
          const currentChannel = ticketsArray[ticketsArray.length - 1]

          currentChannel.messages.fetch({ limit: 100 }).then(messages => {

            messages.forEach(msg => {

              if (msg.embeds[0] && msg.embeds[0].footer && msg.embeds[0].footer.text.includes(newMessage.id.slice(-8))) {

                let oldmsgContent
                if (msg.embeds[0].fields[0]) {
                  oldmsgContent = msg.embeds[0].fields[0].value
                } else {
                  oldmsgContent = msg.embeds[0].description
                }
                let newmsgContent = newMessage.content.length > 0 ? newMessage.content : " "

                const newEmbed = new EmbedBuilder()
                  .setColor("Yellow")
                  .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.displayAvatarURL({ dynamic: true }) })
                  .setFields(
                    { name: "Original Message", value: oldmsgContent },
                    { name: "Edited Message", value: newmsgContent }
                  )
                  .setFooter({ text: `User ID: ${newMessage.author.id} • ${newMessage.id.slice(-8)}\n` })
                  .setTimestamp();

                msg.edit({ embeds: [newEmbed] })

              }
            })
          })



        } else { // No tickets found 
          return
        }
      } else { // There are no active threads!
        return
      }
    }

    if (oldMessage.webhookId || oldMessage.author?.bot || !oldMessage.channel.guild) {
      return
    } else {
      if (oldMessage.content === newMessage.content) return;

      if (oldMessage.content.length && (oldMessage.content.length > 1024 || newMessage.content.length > 1024)) return;

      var msgUpdate = new EmbedBuilder()
        .setAuthor({
          name: newMessage.author.username,
          iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: `id: ` + newMessage.author.id })
        .setTimestamp()
        .addFields(
          { name: "Old message:", value: `${oldMessage}` },
          { name: "New message:", value: `${newMessage}` },
          { name: "Channel:", value: `${oldMessage.channel}` }
        )
        .setColor("Blue");

      // if (oldMessage.author.id == "1158816573751042118") {
      //   oldMessage.channel.send({ embeds: [msgUpdate] }).catch(async (err) => {
      //     console.log(err);
      //     var msgUpdate = new MessageEmbed()
      //       .setAuthor(newMessage.author.username, newMessage.author.avatarURL())
      //       .setFooter(`id: ` + newMessage.author.id)
      //       .setTimestamp()
      //       .addField(
      //         "Message edited:",
      //         `The message content was too large to be logged in an embed, so I'm forwarding it below.`
      //       )
      //       .addField(`Channel:`, `${oldMessage.channel}`)
      //       .setColor("Blue");

      //     client.channels.cache.get(oldMessage.channel).send({
      //       embeds: [msgUpdate],
      //     });
      //     oldMessage.channel.send("**Old Message:**");
      //     oldMessage.channel.send(oldMessage.content);
      //     oldMessage.channel.send("**New Message:**");
      //     oldMessage.channel.send(newMessage.content);
      //   });
      // }

      const logChannel =
        client.channels.cache.get("1052421938221432852");

      logChannel.send({ embeds: [msgUpdate] }).catch(async (err) => {
        console.log(err);
        var msgUpdate = new MessageEmbed()
          .setAuthor(newMessage.author.username, newMessage.author.avatarURL())
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
