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
  const customrolesData = require("../../schemas/customroles");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("privatevc")
      .setDescription("PREMIUM - Create a private Voice Channel for you and your friends.")
      .setDMPermission(false)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("create")
          .setDescription("PREMIUM - Create a private Voice Channel for you and your friends.")
      )
      .addSubcommand((subcommand) =>
        subcommand
        .setName("invite")
        .setDescription("PREMIUM - Invite somebody to come join your private VC.")
        .addUserOption((options) => 
          options
            .setName("user")
            .setDescription("Who do you want to invite?")
            .setRequired(true)  
        )
      )
      .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("PREMIUM - Kick somebody from your VC.")
        .addUserOption((options) => 
          options
            .setName("user")
            .setDescription("Who do you want to kick?")
            .setRequired(true)  
      )
    ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
      
      if (
        interaction.member.roles.cache.some(role => role.id === "854832521358606379") || // Nitro
        interaction.member.roles.cache.some(role => role.id === "995526385718276136") || // Ko-fi Presidential
        interaction.member.roles.cache.some(role => role.id === "995526599929757746") || // Ko-fi Senator
        interaction.member.roles.cache.some(role => role.id === "995526730473275423") || // Ko-fi Representative
        interaction.member.roles.cache.some(role => role.id === "1055374269636415509") || // Presidential
        interaction.member.roles.cache.some(role => role.id === "1055374176518680647") || // Senator
        interaction.member.roles.cache.some(role => role.id === "1055374052803493973") // Representative
        ) {
        
        if (interaction.member.voice.channel) {

          if (interaction.options.getSubcommand() === "create") {
            const primaryUser = interaction.guild.members.cache.get(interaction.user.id)

            const newChannel = interaction.guild.channels.create({
              name: `⭐ ${interaction.member.displayName}'s Private Room`,
              type: ChannelType.GuildVoice,
              userLimit: 10,
              parent: '928406080076255233',
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  deny: ['Connect']
                },
                {
                  id: interaction.user.id,
                  allow: ['Connect', 'DeafenMembers', 'MoveMembers', 'MuteMembers', 'Speak', 'Stream']
                },
              ]
            });

            primaryUser.voice.setChannel(interaction.guild.channels.cache.get((await newChannel).id))
            return interaction.reply({ content: "New Voice Channel created! Use `/privatevc invite` to bring members in, or `/privatevc kick` to remove them! You also have moderator privileges within this channel - don't abuse them!", ephemeral: true})

          }

          if (interaction.options.getSubcommand() === "invite") {
            const invitee = interaction.options.getUser("user")
            const inviteeMember = interaction.guild.members.cache.get(invitee.id)
            const inviter = interaction.user;
            const primaryVC = interaction.member.voice.channel

            if (inviteeMember.voice.channel) {
              if (interaction.member.voice.channel.name[0] === "⭐") {
                const inviteEmbed = new EmbedBuilder()
                  .setAuthor({ name: `${interaction.user.tag} has invited you to join a private VC!`, iconURL: interaction.user.avatarURL() })
                  .setDescription(`If you would like to join ${interaction.user} in their private VC <#${primaryVC.id}> then please hit "Accept" below.`)
                  .setColor("Gold")
                  .setFooter({ text: "This is a premium feature! Boost the server or sign up for a subscription for access to making your own Private VCs!"})
                  .setTimestamp();

                const inviteButtons = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId('vcaccept')
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId('vcdecline')
                    .setLabel("Decline")
                    .setStyle(ButtonStyle.Danger)
                );

                interaction.reply({ content: `An invite to join your VC has been sent to ${invitee}!`, ephemeral: true})
                const msgA = invitee.send({ embeds: [inviteEmbed], components: [inviteButtons] })

                const filter = (i) => {
                  return i.user.id === interaction.user.id;
                };
 
                (await msgA).awaitMessageComponent(filter).then(async (interaction) => {
                  const buttonClicked = interaction.customId;

                  if (buttonClicked === "vcaccept") {
                    const acceptEmbed = new EmbedBuilder()
                      .setColor("Gold")
                      .setDescription(`You have accepted an invitation to join <#${primaryVC.id}>.`);

                    inviteeMember.voice.setChannel(client.channels.cache.get(primaryVC.id))
                    return (await msgA).edit({ embeds: [acceptEmbed], components: [] })

                  }
                  if (buttonClicked === "vcdecline") {
                    const declineEmbed = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription(`You have declined an invitation to join <#${primaryVC.id}>.`);

                    const theyDeclined = new EmbedBuilder()
                      .setColor("Red")
                      .setDescription(`${invitee} has declined to join your VC <#${primaryVC.id}>.`);

                    (await msgA).edit({ embeds: [declineEmbed], components: [] })
                    return inviter.send({ embeds: [theyDeclined] })

                  }

                })

              } else {
                return interaction.reply({ content: "You are not in a premium / private voice chat.", ephemeral: true})
              }
            } else {
              return interaction.reply({ content: "Target user must be in a VC!", ephemeral: true })
            }

          }



          if (interaction.options.getSubcommand() === "kick") {
            const kickee = interaction.options.getUser("user");
            const kickeeMember = interaction.guild.members.cache.get(kickee.id);
            const primaryVC = interaction.member.voice.channel;
            const kickeeVC = kickeeMember.voice.channel;

            if (kickeeVC === primaryVC) {
              if (interaction.member.voice.channel.name[0] === "⭐") {
                if (interaction.member.permissionsIn(primaryVC).has('MoveMembers')) {
                  const kickedEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You have been kicked from <#${primaryVC.id}>.`);
                  kickeeMember.voice.setChannel('1038209853123993740')
                  kickee.send({ embeds: [kickedEmbed] })
                  return interaction.reply({ content: `You have kicked ${kickee} from your VC.`, ephemeral: true })
                } else {
                  return interaction.reply({ content: "This is not your private voice chat!", ephemeral: true })
                }
              } else {
                return interaction.reply({ content: "You are not in a premium / private voice chat.", ephemeral: true })
              }
            } else {
              return interaction.reply({ content: "User is not in the same VC as you.", ephemeral: true })
            }

          }

        } else {
          return interaction.reply({ content: "You have to be in a voice channel to use this command.", ephemeral: true })
        }
      } else {
        return interaction.reply({ content: "You don't have the permissions for this command! This is a premium-only command. If you would like to get access to this command, and several other cool features, you need to boost the server or donate through Ko-fi or Discord! DM <@178689418415177729> for more information.", ephemeral: true})
      }
  
    },
  };
  