const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  IntentsBitField,
  MessageFlags
} = require("discord.js");
const config = require("../../config.json")
const client = module.exports = {
    name: "closeticket",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const nameArgs = interaction.channel.name.split("-")
        const targetDiscrim1 = `${nameArgs[0]}`
        const targetDiscrim = targetDiscrim1.replace("_", " ")
        let targetUser = client.users.cache.find(u => u.username === targetDiscrim);

        if (!targetUser) {
            try {
                const guildMembers = await interaction.guild.members.fetch();
                targetUser = guildMembers.find(m => m.user.username === targetDiscrim)?.user;
            } catch (err) {
                console.error("❌ Failed to find target user:", err);
            }
        }


        const mainChannel = interaction.channel;
        const mainEmbed = interaction.message.embeds[0]
        const mainMessage = interaction.message

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

        const response = await interaction.reply({
            embeds: [confirmEmbed],
            components: [confirmRow],
            withResponse: true,
        });

        const confirmMsg = response.resource.message;

        confirmMsg.awaitMessageComponent({
            time: 180000,
            filter: i => i.user.id === interaction.user.id,
        }).then(async (interaction) => {
            const buttonClicked = interaction.customId;

            if (buttonClicked === 'cancelclose') {
                return interaction.update({ content: "Cancelled.", embeds: [], components: [] })
            }
            await mainMessage.edit({ embeds: [mainMessage.embeds[0]], components: [] })

            const closeEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Your ${mainEmbed.fields[0].value} ticket has been closed.`);

            await interaction.update({ content: `This thread has been closed by ${interaction.user}.`, embeds: [], components: [] })
            await mainChannel.setArchived(true)

            console.log(targetUser)

            if (targetUser) {
                await targetUser.send({ embeds: [closeEmbed] }).catch(async (err) => {
                    console.warn("⚠️ Could not DM user:", err.message);
                });
            } else {
                console.warn("⚠️ targetUser is undefined — DM not sent.");
            }


        }).catch(error => {
            console.log(error)
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({ content: "Prompt likely timed out.", flags: [MessageFlags.Ephemeral] });
            } else {
                return interaction.followUp({ content: "Prompt likely timed out.", flags: [MessageFlags.Ephemeral] });
            }
        })

    },
};

