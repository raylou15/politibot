const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "appeals",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        const ticketsCategory = config.ticketParent
        const firstMsg = interaction.message 

        const reasonModal = new ModalBuilder()
            .setCustomId('reasons')
            .setTitle('Reason for Opening Ticket')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('reasoninput')
                        .setLabel('Reason Input')
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(1024)
                        .setRequired(true)
                )
            )

        await interaction.showModal(reasonModal)

        const modalSubmitted = await interaction.awaitModalSubmit({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error(error)
            return interaction.message.edit({ content: "Interaction has failed. Modal likely timed out.", embeds: [], components: [] })
        })

        const submitEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle('Operation Politics Modmail System')
        .setDescription('Are you sure you want to submit this ticket to the Appeals category?')
        .addFields([
            { name: "Category", value: "Appeals" },
            { name: "Reason:", value: modalSubmitted.fields.getTextInputValue('reasoninput') }
        ]);

        firstMsg.edit({ content: "Please make a confirmation below.", embeds: [], components: [] })

        modalSubmitted.reply({
            embeds: [submitEmbed],
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirmticket')
                    .setLabel('Confirm')
                    .setEmoji('✅')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancelticket')
                    .setLabel('Cancel')
                    .setEmoji('❎')
                    .setStyle(ButtonStyle.Danger)
            )]
        })

    },
  };
  
