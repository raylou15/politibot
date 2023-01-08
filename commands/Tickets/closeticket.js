const {ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const ticketHandler = require("../../handlers/tickethandler");
const client = (module.exports = {
data: new SlashCommandBuilder()
    .setName("closeticket")
    .setDescription("Close a ticket to contact Server Staff")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const nameArgs = interaction.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        const targetUser = client.users.cache.find(u => u.tag === targetDiscrim)

        const mainChannel = interaction.channel;
        const mainEmbed = interaction.message.embeds[0]
        const fetchmessages = await interaction.channel.messages.fetch({
            after: 1,
            limit: 1
        });
        const mainMessage = fetchmessages.first()

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
            await mainMessage.edit({ embeds: [mainMessage.embeds[0]], components: [] })

            const closeEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Your ${mainEmbed.fields[0].value} ticket has been closed.`);

            await interaction.update({ content: `This thread has been closed by ${interaction.user}.`, embeds: [], components: [] })
            await targetUser.send({ embeds: [closeEmbed] })
            await mainChannel.setArchived(true)

        }).catch(error => {
            console.log(error)
            return prompt.edit({ content: "Prompt likely timed out.", embeds: [], components: [] })
        })

    },
  });
  