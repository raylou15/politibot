const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
} = require("discord.js");


let purgeList = [
    '247869218245050368', // Coriolanus
    '1203127224484757534', // Mercedes
    '699107296596459521', // all_kaps
    '326961459957465088', // sodapop
    '1158178519055073370', // zaza dealer / supersonic
    '1234355715917746187', // datboi
    '665713245423665163', // lannis
    '318213015059038209', // ronald
    '1072651155659817083', // countender66
]

const infractionData = require("../../schemas/infractions");
const CaseCountSchema = require("../../schemas/casecount");
const ms = require("ms");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("startthepurge")
        .setDescription("Ban a user for misbehavior")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
    ,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const purgechannel = interaction.channel

        interaction.reply('https://www.youtube.com/watch?v=us_0aLWOa8E')
        const purgeEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription("THE PURGE HAS BEGUN.... if you ping someone who has been selected for the purge, you initiate their purge and they shall be banned from the server! Have fun :)")
        purgechannel.send({ embeds: [purgeEmbed] })

        const numValuedoc = await CaseCountSchema.find({
            _id: "637acf789ff4d033474c8454",
        });
        let numValue = numValuedoc[0].CaseCount;


        purgeList.forEach(uid => {
            const collectorFiler = m => m.content.includes(uid)
            const collector = interaction.channel.createMessageCollector({ filter: collectorFiler, time: 240_000 });

            collector.on('collect', m => {
                console.log(`Collected ${m.content}`)

                purgeList = purgeList.filter(item => item !== uid)

                const target = interaction.guild.members.cache.get(uid)
                if (!target) {
                    return
                }


                const purgeEmbed1 = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`You've found a purge victim... ${purgeList.length} victims remain.`)

                const purgeEmbed2 = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription("You've found a purge victim... this was the final victim.")

                const purgeEmbedEnd = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription("The annual purge has concluded. See you next year!")


                console.log("Case Count: " + numValue);
                const caseNumVal = numValue + 1;
                console.log("Case Number Assigned: " + caseNumVal);

                

                const banEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({
                        name: `${target.user.username}`,
                        iconURL: `${target.user.displayAvatarURL()}`,
                    })
                    .setDescription(`**Member banned:**\n🔨 ${target.user} (${target.id})`)
                    .addFields(
                        { name: "**Reason:**", value: `The Purge` + " | " + `You have been purged in the annual purge.` },
                        { name: "**Case ID:**", value: caseNumVal.toString() }
                    )
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setTimestamp();

                const banDMEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({
                        name: interaction.guild.name,
                        iconURL: interaction.guild.iconURL(),
                    })
                    .setTitle(`A moderator has **banned** you:`)
                    .addFields(
                        { name: "**Reason:**", value: `The Purge` + " | " + `You have been purged in the annual purge.` },
                        { name: "**Case ID:**", value: caseNumVal.toString() }
                    )
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setTimestamp();
                const appealRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Appeal Server")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.gg/fUYy57GRqT")
                );

                
                const logChannel = interaction.guild.channels.cache.get("1052421373353525351");
                const pubLogChannel = interaction.guild.channels.cache.get("1129110488274456577");


                logChannel.send({ embeds: [banEmbed] })
                pubLogChannel.send({ embeds: [banEmbed]});
                target.user.send({ embeds: [banDMEmbed], components: [appealRow] }).catch(async (err) => {
                    console.log(err);
                    logChannel.send({
                        content:
                            "I couldn't DM this user since they do not accept DMs from server bots/members.",
                    });
                });

                if (purgeList.length > 0) {
                    m.reply({ embeds: [purgeEmbed1] })
                    interaction.channel.send({ embeds: [banEmbed] })
                } else {
                    m.reply({ embeds: [purgeEmbed2] })
                    interaction.channel.send({ embeds: [banEmbed] })
                    interaction.channel.send('https://www.youtube.com/watch?v=sDwnJiKzr48')
                    interaction.channel.send({ embeds: [purgeEmbedEnd] })
                    collector.stop()
                }


                let profileData = new infractionData({
                    CaseID: caseNumVal,
                    TargetID: target.id,
                    IssuerID: interaction.user.id,
                    InfractionType: "Ban",
                    Date: Date.now(),
                    Reason: `The Purge` + " | " + `You have been purged in the annual purge.`,
                  });
                profileData.save().catch(console.error);

                target.ban().catch((err) => {
                    interaction.reply({
                      embeds: [
                        errorsEmbed.setDescription(
                          "Could not ban this user due an uncommon error."
                        ),
                      ],
                    });
                    return console.log("Error occurred in ban.js", err);
                });

                numValue = numValue + 1

                CaseCountSchema.findOneAndUpdate({
                    _id: "637acf789ff4d033474c8454",
                    CaseCount: numValue + 1,
                });

            })

        })

        


    },
};
