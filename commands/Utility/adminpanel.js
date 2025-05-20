const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Embed,
  ComponentType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder
} = require("discord.js");
const { loadCommands, loadComponents } = require("../../handlers/handler");
const { loadEvents } = require("../../handlers/handler");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adminpanel")
    .setDescription("For quick bot restarting/refreshing.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    const panel = new ContainerBuilder()
      .setAccentColor([180, 172, 188])
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ⚙️  Admin Panel`))
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("reloadcommands")
              .setLabel("Reload Commands")
              .setStyle(ButtonStyle.Primary)
          )
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("reloadbuttons")
              .setLabel("Reload Buttons")
              .setStyle(ButtonStyle.Primary)
          )
      )
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("reloadevents")
              .setLabel("Reload Events")
              .setStyle(ButtonStyle.Primary)
          )
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(2))
      .addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            [
              new ButtonBuilder()
                .setCustomId("reloadall")
                .setLabel("Reload All")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("restartbot")
                .setLabel("Restart Bot")
                .setStyle(ButtonStyle.Danger)
            ]
          )
      )

    await interaction.reply({
      components: [panel],
      flags: [
        MessageFlags.Ephemeral,
        MessageFlags.IsComponentsV2
      ]
    })
  
  },
};
