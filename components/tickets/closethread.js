const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ButtonComponent,
    Component,
    SelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuInteraction,
    ButtonInteraction,
    ComponentType,
    Embed,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
  } = require("discord.js");
  const client = module.exports = {
    name: "closethread",
    description: "Close a ticket.",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        console.log(interaction.channel.parent.availableTags)

        const nameArgs = interaction.channel.name.split("-")
        const targetDiscrim = `${nameArgs[0]}#${nameArgs[1]}`
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)

        const reasonModal = new ModalBuilder()

        const promptModal = new ModalBuilder()
            .setCustomId('promptmodal')
            .setTitle('Reason for Closing');

            const reasonInput = new TextInputBuilder()
            .setCustomId('reasoninput')
            .setLabel('This will be shared with the ticket opener:')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(2000)
            .setPlaceholder('Type your reason here. This prompt expires in 180 seconds. Do not click off of this prompt.')
            .setRequired(true);

            const modalRow = new ActionRowBuilder().addComponents(reasonInput)

            promptModal.addComponents(modalRow)

            await interaction.showModal(promptModal)

            const reasonGiven = await interaction.awaitModalSubmit({ time: 180_000 }).then(async (interaction) => {

                const reasonGiven = interaction.fields.getTextInputValue('reasoninput')

                const closeReasonEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`Ticket ${interaction.channel.name} Closed`)
                .setDescription(`**Reason:** ${reasonGiven}`)
                .setFooter({ text: "If you would like to open another ticket, please do so. However, please be aware that we can and will blacklist abusers permanently."})

                targetUser.send({ embeds: [closeReasonEmbed] })
                interaction.reply({ content: `Ticket closed by ${interaction.user}`, embeds: [closeReasonEmbed] })
                interaction.message.edit({ components: [] })
                interaction.channel.setArchived(true)
                interaction.channel.setLocked(true)

            }).catch(error => {
                console.log(error)
                return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
            })

    },
  };
  