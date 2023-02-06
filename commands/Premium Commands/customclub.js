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
    ChannelType,
  } = require("discord.js");
  const ms = require("ms");
  const customclubData = require("../../schemas/customclubs");
  module.exports = {
    data: new SlashCommandBuilder()
        .setName("customclub")
        .setDescription("PREMIUM - Create a custom club for you and your friends!")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('PREMIUM - Create a new club for you and your friends!')
            .addStringOption((options) =>
                options
                .setName("name")
                .setDescription("Club Name")
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
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('add')
            .setDescription('PREMIUM - Add a friend to your club!')
            .addUserOption(options =>
                options
                .setName("friend")
                .setDescription("Who's the friend you want to add to your club?")   
                .setRequired(true) 
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('remove')
            .setDescription('PREMIUM - Remove somebody from your club!')
            .addUserOption(options =>
                options
                .setName("user")
                .setDescription("Who's the user you want to remove from your club?")   
                .setRequired(true) 
            )
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        
        if (interaction.options.getSubcommand() === "create") {
            if (
                interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
                interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
                interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
                interaction.member.roles.cache.some(role => role.id === "995526730473275423") || // Ko-fi Representative
                interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
                interaction.member.roles.cache.some(role => role.id === "1055374176518680647") || // Senator
                interaction.member.roles.cache.some(role => role.id === "1055374052803493973") || 
                interaction.member.id === "154381055841927168" // Representative
                ) {
                let clubProfile;
                clubProfile = await customclubData.findOne({
                    UserID: interaction.user.id
                });
                if (clubProfile === undefined || !clubProfile) {
            
                    const clubName = interaction.options.getString("name");
                    const roleColor = interaction.options.getString("color");
                    const roleIcon = interaction.options.getAttachment("icon");

                    const newRole = interaction.guild.roles.create({
                        name: clubName,
                        color: roleColor,
                        icon: roleIcon.url,
                        position: interaction.guild.roles.cache.find(role => role.id === "922598781193687080").position + 1
                    })

                    const newChannel = interaction.guild.channels.create({
                        name: clubName,
                        type: ChannelType.GuildText,
                        parent: '940449119703547914',
                        permissionOverwrites: [
                            {
                                id: (await newRole).id,
                                allow: ['ViewChannel']
                            },
                            {
                                id: interaction.guild.id,
                                deny: ['ViewChannel']
                            },
                        ]
                    });

                    clubProfile = new customclubData({
                        UserID: interaction.user.id,
                        RoleID: (await newRole).id,
                        ClubName: clubName,
                        ClubChannel: (await newChannel).id
                    });
                    await clubProfile.save().catch(console.error);

                    interaction.reply({ content: `Congratulations! Your new club <#${(await newChannel).id}> has been created with the role <@&${(await newRole).id}>! You can now invite people by using` + '`/customclub add` or remove them with `/customclub remove`!'})
                    interaction.member.roles.add(`${(await newRole).id}`)
                    return (await newChannel).send(`Welcome <@&${(await newRole).id}>!`)

                } else {
                    return interaction.reply({ content: 'Uh oh! Looks like you have a custom club already! Users are only allowed one custom club. If you would like to *change* your custom club, contact <@178689418415177729>.', ephemeral: true })
                }
        
            } else {
            return interaction.reply({ content: "You don't have the permissions for this command!", ephemeral: true})
            }
        }

        if (interaction.options.getSubcommand() === "add") {
            if (
                interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
                interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
                interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
                interaction.member.roles.cache.some(role => role.id === "995526730473275423") || // Ko-fi Representative
                interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
                interaction.member.roles.cache.some(role => role.id === "1055374176518680647") || // Senator
                interaction.member.roles.cache.some(role => role.id === "1055374052803493973") // Representative
                ) {
                let clubProfile;
                clubProfile = await customclubData.findOne({
                    UserID: interaction.user.id
                });
                if (clubProfile) {
            
                    const targetUser = interaction.options.getUser("friend")
                    const targetMember = interaction.guild.members.cache.get(`${targetUser.id}`)
                    const clubRole = interaction.guild.roles.cache.get(`${clubProfile.RoleID}`)
                    const ClubChannel = interaction.guild.channels.cache.get(`${clubProfile.ClubChannel}`)

                    targetUser.send(`You have been added to a private club by ${interaction.user}`)
                    targetMember.roles.add(`${clubRole.id}`)
                    interaction.reply({ content: `<@${targetUser.id}> has been added to <#${ClubChannel.id}>!`, ephemeral: true})
                    return ClubChannel.send(`<@${targetUser.id}> welcome to <#${ClubChannel.id}>!`)
            
                } else {
                    return interaction.reply({ content: 'Uh oh! Looks like you do not have a custom club yet! Run `/customclub create` to make one!', ephemeral: true })
                }
            
            } else {
            return interaction.reply({ content: "You don't have the permissions for this command!", ephemeral: true})
            }
        }

        if (interaction.options.getSubcommand() === "remove") {
            if (
                interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
                interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
                interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
                interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
                interaction.member.roles.cache.some(role => role.id === "1055374176518680647") // Senator

                ) {
                let clubProfile;
                clubProfile = await customclubData.findOne({
                    UserID: interaction.user.id
                });
                if (clubProfile) {
            
                    const targetUser = interaction.options.getUser("user")
                    const targetMember = interaction.guild.members.cache.get(`${targetUser.id}`)
                    const clubRole = interaction.guild.roles.cache.get(`${clubProfile.RoleID}`)
                    const ClubChannel = interaction.guild.channels.cache.get(`${clubProfile.ClubChannel}`)

                    targetUser.send("you're no longer my friend :(")
                    targetMember.roles.remove(`${clubRole.id}`).catch((err) => { interaction.reply({ content: "This member is not apart of your club.", ephemeral: true}) })
                    interaction.reply({ content: `<@${targetUser.id}> has been removed from <#${ClubChannel.id}>!`, ephemeral: true})
                    return ClubChannel.send(`<@${targetUser.id}> has been removed from <#${ClubChannel.id}>!`)
            
                } else {
                    return interaction.reply({ content: 'Uh oh! Looks like you do not have a custom club yet! Run `/customclub create` to make one!', ephemeral: true })
                }
        
            } else {
                return interaction.reply({ content: "You don't have the permissions for this command! This is a premium-only command. If you would like to get access to this command, and several other cool features, you need to boost the server or donate through Ko-fi or Discord! DM <@178689418415177729> for more information.", ephemeral: true})
            } 
        }
  
    },

};
  