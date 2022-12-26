const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  ModalSubmitInteraction,
} = require("discord.js");
const ms = require("ms");
const customrolesData = require("../../schemas/customroles");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("customrole")
    .setDescription("PREMIUM - Create a custom role to identify yourself!")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("name")
        .setDescription("Role Name")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("color")
        .setDescription("Provide a Hex Code (with # included)")
        .setRequired(true)
    )
    .addAttachmentOption((options) =>
      options
        .setName("icon")
        .setDescription("Provide an icon to show up by your name!")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    
    if (
        interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
        interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
        interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
        interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
        interaction.member.roles.cache.some(role => role.id === "1055374176518680647") // Senator
        ) {
      let roleProfile;
      roleProfile = await customrolesData.findOne({
        UserID: interaction.user.id
      });
      if (roleProfile === undefined || !roleProfile) {

        const roleName = interaction.options.getString("name");
        const roleColor = interaction.options.getString("color");
        const roleIcon = interaction.options.getAttachment("icon");

        const newRole = interaction.guild.roles.create({
          name: roleName,
          color: roleColor,
          icon: roleIcon.url,
          position: interaction.guild.roles.cache.find(role => role.id === "922600447158665226").position + 1
        })

        console.log(`Made a new custom role! ${interaction.user.id}`);
        roleProfile = new customrolesData({
          UserID: interaction.user.id,
          RoleID: (await newRole).id,
        });
        await roleProfile.save().catch(console.error);

        interaction.member.roles.add(`${(await newRole).id}`)
        interaction.reply({ content: `<@&${(await newRole).id}> has been created!`, ephemeral: true})

      } else {
        return interaction.reply({ content: 'Uh oh! Looks like you have a custom role already! Users are only allowed one custom role. If you would like to *change* your custom role, contact <@178689418415177729>.', ephemeral: true })
      }

    } else {
      return interaction.reply({ content: "You don't have the permissions for this command! This is a premium-only command. If you would like to get access to this command, and several other cool features, you need to boost the server or donate through Ko-fi or Discord! DM <@178689418415177729> for more information.", ephemeral: true})
    }

  },
};
 