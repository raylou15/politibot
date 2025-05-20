const {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  EmbedBuilder,
  ButtonStyle,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  MessageFlags
} = require("discord.js");
const { execute } = require("./ready");
const config = require("../../config.json")
const TicketCountSchema = require("../../schemas/ticketcount");
const ticketHandler = require("../../handlers/tickethandler");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param { ApplicationCommandAutocomplete | ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction | SelectMenuInteraction} interaction
   */
  async execute(interaction, client) {

    if (!interaction.isButton() && !interaction.isModalSubmit()) {
      return
    } else {
      if (interaction.customId === 'appeals' || interaction.customId === 'bot support' || interaction.customId === 'moderation' || interaction.customId === 'other' || interaction.customId === 'partnerships') {

        const ticketModal = new ModalBuilder()
          .setCustomId(`ticketModal-${interaction.customId}-${interaction.message.id}`)
          .setTitle("Operation Politics Modmail System")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('reasoninput')
                .setLabel('Reason for Ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setMaxLength(1024)
                .setRequired(true)
                .setPlaceholder('Please explain why you are opening this ticket.')
            )
          )

        await interaction.showModal(ticketModal)

      }

      if (interaction.customId.includes("ticketModal")) {
        const reason = interaction.fields.getTextInputValue('reasoninput')
        const idcomponents = interaction.customId.split(`-`)
        const category = idcomponents[1]
        const msgid = idcomponents[2]
        let categoryRevised;
        if (category === "appeals") { categoryRevised = "Appeals" }
        if (category === "bot support") { categoryRevised = "Bot Support" }
        if (category === "moderation") { categoryRevised = "Moderation" }
        if (category === "other") { categoryRevised = "Other Help" }
        if (category === "partnerships") { categoryRevised = "Partnerships" }

        const confirmationEmbed = new EmbedBuilder()
          .setColor("Yellow")
          .setTitle("Operation Politics Modmail System")
          .setDescription(`Please review your ticket below before submitting it to the ${categoryRevised} category.`)
          .setFields(
            { name: "Category", value: `${categoryRevised}` },
            { name: "Reason", value: `${reason}` }
          )

        const confirmationButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('confirmticket')
            .setLabel('Confirm')
            .setEmoji('✔')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('cancelticket')
            .setLabel('Cancel')
            .setEmoji('✖')
            .setStyle(ButtonStyle.Danger)
        )

        interaction.channel.messages.fetch(msgid).then(msg => msg.edit({ content: "Please make a confirmation below.", embeds: [], components: [] }))
        const response = await interaction.reply({
          embeds: [confirmationEmbed],
          components: [confirmationButtons],
          withResponse: true,
        });

        const confirmDeny = response.resource.message;

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
          const confirmation = await confirmDeny.awaitMessageComponent({
            filter: collectorFilter,
            time: 180_000,
          });

          if (confirmation.customId === 'cancelticket') {
            return await confirmation.update({
              content: "Ticket cancelled.",
              embeds: [],
              components: []
            });
          }

          if (confirmation.customId === 'confirmticket') {

            const ticketCount = await TicketCountSchema.find({
              _id: "63b9fb11264cc64866585953"
            });
            const ticketNum = ticketCount[0].TicketCount + 1
            await TicketCountSchema.findOneAndUpdate({
              _id: "63b9fb11264cc64866585953",
              TicketCount: ticketNum,
            });

            const ticketPreview = new EmbedBuilder()
              .setColor('Green')
              .setTitle('New Ticket Opened')
              .setAuthor({ name: interaction.user.username })
              .setDescription(`A new ticket has been opened by ${interaction.user}`)
              .setFields([
                { name: "Category", value: "Moderation" },
                { name: "Reason:", value: `${reason}`, inline: true },
                { name: "Claimed by:", value: "N/A", inline: true }
              ])
              .setFooter({ text: "Please claim the ticket before proceeding." })

            const ticketPreviewU = new EmbedBuilder()
              .setColor('Green')
              .setTitle('New Ticket Opened')
              .setAuthor({ name: interaction.user.tag })
              .setDescription(`A new ticket has been opened by ${interaction.user}`)
              .setFields([
                { name: "Category", value: "Moderation" },
                { name: "Reason:", value: `${reason}` }
              ])

            const ticketInstructions = new EmbedBuilder()
              .setColor('Yellow')
              .setDescription('A new ticket has been opened! Please be patient and wait for a response from staff, or provide additional information if necessary. \n\nYou can reply to staff or communicate with them by DMing this bot. A green checkmark reaction indicates that the message has been successfully sent, whereas a red cross reaction indicates that the message has failed and you should try again. \n\nPlease note that we prefer message links over screenshots of messages whenever applicable or possible, but we can see any screenshots or videos you send us through here.')

            const ticketButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('claimticket')
                .setLabel('Claim Ticket')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId('closeticket')
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId('takeover')
                .setLabel('❗')
                .setStyle(ButtonStyle.Secondary)
            )

            await interaction.editReply({ content: "See below:", embeds: [ticketPreviewU, ticketInstructions], components: [] })

            const ticketName = `${interaction.user.username}-${ticketNum}`;
            const ticketContact = false;

            ticketHandler.TicketCreate(client, ticketName, category, ticketPreview, ticketButtons, ticketContact)

          }
        } catch (e) {
          console.warn(e)
          await interaction.editReply({ content: "Interaction failed. Prompt likely timed out — please try again.", embeds: [], components: [] })
        }

      }
    }

  },
};
