const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "closeticket",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const nameArgs = message.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)

        mainChannel = interaction.channel;
        mainEmbed = interaction.message.embeds[0]

        const confirmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Are you sure you want to close this thread?");

        const confirmRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('confirmclose')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('cancelclose')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
        );

        const confirmMsg = await interaction.reply({ embeds: [confirmEmbed], components: [confirmRow], fetchReply: true })

        confirmMsg.awaitMessageComponent({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).then(async (interaction) => {
            buttonClicked = interaction.customId

            if (buttonClicked === 'cancelclose') {
                return interaction.update({ content: "Cancelled.", embeds: [], components: [] })
            }

            const closeEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Your ticket has been closed.");

            mainChannel.send(`This thread has been closed by ${interaction.user}.`)
            targetUser.send({ embeds: [closeEmbed] })
            mainChannel.setArchived(true)

        })

    },
  };
  
