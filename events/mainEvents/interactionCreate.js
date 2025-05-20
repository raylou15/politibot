const {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  EmbedBuilder,
  InteractionType,
  MessageFlags
} = require("discord.js");
const { execute } = require("./ready");
const verifyData = require("../../schemas/verificationdata");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param { ApplicationCommandAutocomplete | ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction | SelectMenuInteraction} interaction
   */
  async execute(interaction, client) {
    if (
      !interaction.isChatInputCommand() &&
      !interaction.isContextMenuCommand() &&
      !interaction.isButton &&
      !interaction.isSelectMenu
    )
      return;

    const command = client.commands.get(interaction.commandName);
    const component = client.components.get(interaction.customId);

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      try {
        await command.autocomplete(interaction, client);
        return console.log("autocomplete loaded for command")
      } catch (error) {
        return console.error(error)
      }
    }

    if (!command && !component) {
      if (!interaction.customId) {
        return interaction.reply({
          content:
            "This command is outdated, or incomplete. Try refreshing discord (`ctrl+r`) to see if it fixes the issue.",
          flags: [MessageFlags.Ephemeral],
        });
      } else if (interaction.customId) {
        if (
          // interaction.customId === "idkb" ||
          interaction.customId === "yesb" ||
          interaction.customId === "noa" ||
          interaction.customId === "idka" ||
          interaction.customId === "rule9" ||
          interaction.customId === "rule6" ||
          interaction.customId === "rule5" ||
          interaction.customId === "rule8" ||
          interaction.customId === "rule4" ||
          interaction.customId === "rule12"
        ) {
            const failEmbed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                "Oops! You failed the verification process. Please try again."
              );
            let verifyProfile;
            verifyProfile = await verifyData.find({
              UserID: interaction.user.id,
            });
            const logEmbed = new EmbedBuilder()
              .setColor("Red")
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
              })
              .addFields(
                {
                  name: "Attempt Number:",
                  value: "`" + `${verifyProfile[0].attemptNum.toString()}` + "`",
                },
                { name: "Age:", value: "`" + `${verifyProfile[0].Age}` + "`" },
                {
                  name: "Student Hub:",
                  value: "`" + `${verifyProfile[0].StudentHub}` + "`",
                }
              );
            const logChannel =
              interaction.guild.channels.cache.get("984871497640321025");
            logChannel.send({ embeds: [logEmbed] });
            return interaction.update({ embeds: [failEmbed], components: [] });
        } else if (interaction.customId) {
          splitArray = interaction.customId.split("-");
          if (splitArray[0] === "MemberLogging") {

            const member = (await interaction.guild.members.fetch(splitArray[2]));
            const errorembed = new EmbedBuilder();
            const errorArray = [];
  
            if(!interaction.member.permissions.has("KickMembers")) {
                errorArray.push("You must be a **Senior Moderator** or **Moderator** to use this button.")
            }
    
            if(!member) {
            return interaction.reply("This member has likely left the server.")
            }
            
            if(errorArray.length) return interaction.reply({
                embeds: [errorembed.setDescription(errorArray.join("\n"))],
                flags: [MessageFlags.Ephemeral]
            });
    
            switch(splitArray[1]) {
                case "Kick" : {
                    member.user.send("You have been kicked by a moderator due to having a suspicious account. We do this based on factors such as your account join date, in order to help filter out bots from our server. If you think this was in error, please rejoin our server: discord.gg/operationpolitics")
                    member.kick(`Kicked by ${interaction.user.username} | New Member Filtering`).then(() => {
                        interaction.reply({ embeds: [errorembed.setDescription(`${member} has been kicked by ${interaction.user.username}`).setColor("DarkRed")]})
                    }).catch(() => {
                        interaction.reply({ embeds: [errorembed.setDescription(`${member} could not be kicked due to a rare error.`).setColor("DarkRed")], flags: [MessageFlags.Ephemeral]})
                    })
                }
                break;
                case "Ban" : {
                    member.ban(`Banned by ${interaction.user.username} | New Member Filtering`).then(() => {
                        interaction.reply({ embeds: [errorembed.setDescription(`${member} has been banned by ${interaction.user.username}`).setColor("DarkRed")]})
                    }).catch(() => {
                        interaction.reply({ embeds: [errorembed.setDescription(`${member} could not be banned due to a rare error.`).setColor("DarkRed")], flags: [MessageFlags.Ephemeral]})
                    })
                }
                break;
            }
          } else {
            return
          }
        } else {
          return
        }
      }
    }

    if (command) {
      return command.execute(interaction, client);
    } else if (component) {
      return component.execute(interaction, client);
    }

    // if (command.developer && interaction.user.id !== "178689418415177729")
    //   return interaction.reply({
    //     content: "This command is only available to the developer",
    //     flags: [MessageFlags.Ephemeral],
    //   });
  },
};
