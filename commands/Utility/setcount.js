const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require("discord.js");
const messagecountData = require("../../schemas/messagecount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setcount")
    .setDescription("Restarts the bot entirely!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((options) =>
      options
        .setName("target")
        .setDescription("User to target")
        .setRequired(true)
    )
    .addNumberOption((options) =>
      options
        .setName("count")
        .setDescription("Count to set their message total to")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const number = interaction.options.getNumber("count");

    let msgCountProfile;
    msgCountProfile = await messagecountData.findOne({ UserID: target.id });
    if (msgCountProfile === undefined || !msgCountProfile) {
      console.log(`Made a new msgCountProfile! ${target.id}`);
      msgCountProfile = new messagecountData({
        UserID: target.id,
        msgCount: number,
      });
      await msgCountProfile.save().catch(console.error);
      interaction.reply({
        content: `Success! ${target}'s message count set to ${number.toString()}!`,
        ephemeral: true,
      });
    } else {
      console.log(target.id);
      await messagecountData.findOneAndUpdate(
        { UserID: target.id },
        { $set: { msgCount: number } }
      );
      console.log(number);
      interaction.reply({
        content: `Success! ${target}'s message count set to ${number.toString()}!`,
        ephemeral: true,
      });
    }
  },
};
