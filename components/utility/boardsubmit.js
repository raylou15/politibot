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
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  MessageFlags
} = require("discord.js");
const config = require("../../config.json");
const { sync } = require("glob");
const client = module.exports = {
    name: "boardsubmit",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const mainEmbed = interaction.message.embeds[0]
        let ruling;

        if (interaction.member.roles.cache.has('1278152738953363568')) {
            const dropdown = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('boardRuling')
                    .setPlaceholder('Please indicate the ruling.')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('COMPLETELY FALSE')
                            .setValue('completely false'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('MOSTLY FALSE')
                            .setValue('mostly false'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('HALF TRUE')
                            .setValue('half true'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('MOSTLY TRUE')
                            .setValue('mostly true'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('COMPLETELY TRUE')
                            .setValue('completely true'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('MISLEADING')
                            .setDescription('Not necessarily false, but misleading.')
                            .setValue('misleading'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('NO RULING')
                            .setDescription('Unclear if it is true or unable to make a ruling due to deadlock or otherwise.')
                            .setValue('no ruling')
                    )
            )

            const response = await interaction.reply({ components: [dropdown], flags: [MessageFlags.Ephemeral], withResponse: true })

            const collector = response.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 3600000 });

            console.log("Okay!")

            collector.on('collect', async i => {
                console.log("yuh")
                ruling = i.values[0];

                const reportmodal = new ModalBuilder()
                    .setCustomId(`factcheckreport`)
                    .setTitle("Fact Check Report")
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('factcheckreportinfavor')
                                .setLabel('Votes in Favor')
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(3)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('factcheckreportopposition')
                                .setLabel('Votes in Opposition')
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(3)
                                .setRequired(true),
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('factcheckreportabstention')
                                .setLabel('Votes in Abstention')
                                .setPlaceholder("Include anyone who didn't vote, too.")
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(3)
                                .setRequired(true),
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('factcheckreportreason')
                                .setLabel('Reasons for Ruling')
                                .setPlaceholder("Input reasons for fact check ruling. Include relevant links that prove the reason for this report.")
                                .setStyle(TextInputStyle.Paragraph)
                                .setMinLength(24)
                                .setMaxLength(1024)
                                .setRequired(true),
                        )
                    )

                await i.showModal(reportmodal)

                const modalresponse = await i.awaitModalSubmit({ time: 180000 }).catch(error => {
                    console.error(error)
                    return null
                })

                if (modalresponse) {
                    console.log("test")

                    const factcheckreportinfavor = modalresponse.fields.getTextInputValue("factcheckreportinfavor")
                    const factcheckreportabstention = modalresponse.fields.getTextInputValue("factcheckreportabstention")
                    const factcheckreportopposition = modalresponse.fields.getTextInputValue("factcheckreportopposition")
                    const factcheckreportreason = modalresponse.fields.getTextInputValue("factcheckreportreason")

                    const totalVotes = Number(factcheckreportinfavor) + Number(factcheckreportabstention) + Number(factcheckreportopposition)
                    const totalMembers = i.guild.roles.cache.get('1278152704161484923').members.size
                    if (totalVotes === totalMembers) {
                        if (factcheckreportinfavor >= (2/3) * (totalVotes - Number(factcheckreportabstention)) ) {
                            const reportEmbed = new EmbedBuilder()
                            .setColor("Blue")
                            .setFields(
                                { name: "Initial claim:", value: mainEmbed.fields[3].value },
                                { name: "Requested by:", value: mainEmbed.fields[0].value, inline: true },
                                { name: "Claim made by:", value: mainEmbed.fields[1].value, inline: true },
                                { name: "Original message:", value: mainEmbed.fields[2].value, inline: true },
                                { name: "RULING:", value: `**${ruling.toUpperCase()}**` },
                                { name: "Reasoning:", value: `${factcheckreportreason}` },
                                { name: "Votes in Favor:", value: `${factcheckreportinfavor}`, inline: true },
                                { name: "Votes in Abstention:", value: `${factcheckreportabstention}`, inline: true },
                                { name: "Votes in Opposition:", value: `${factcheckreportopposition}`, inline: true }
                            )

                            const reportChannel = interaction.guild.channels.cache.get("1278149205122355282")

                            reportChannel.send({ content: `${mainEmbed.fields[0].value} ${mainEmbed.fields[1].value}`, embeds: [reportEmbed] })
                            modalresponse.reply({ content: "Report submitted.", flags: [MessageFlags.Ephemeral] })
                            interaction.message.edit({ embeds: [mainEmbed], components: [] })

                        } else {
                            modalresponse.reply({ content: `The votes in favor does not reach the 2/3rds majority threshold necessary to adopt this ruling. Please double check your count!`, flags: [MessageFlags.Ephemeral] })
                        }
                    } else {
                        modalresponse.reply({ content: `Not all members are accounted for in the vote. You said there were ${totalVotes} votes, but there are ${totalMembers}. Please double check your count!`, flags: [MessageFlags.Ephemeral] })
                    }
                }

            })

        } else {
            interaction.reply({ content: "You're not the Chairman! Only the Chairman can fill this out.", flags: [MessageFlags.Ephemeral] })
        }

    },
};

