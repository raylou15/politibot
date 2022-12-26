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
  } = require("discord.js");
  const client = module.exports = {
    name: "claimthread",
    description: "Claim a ticket.",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {
      
        const oldEmbed = interaction.message.embeds[0].data

        const newEmbed = new EmbedBuilder()
        .setColor(oldEmbed.color)
        .setAuthor({ name: oldEmbed.author.name, iconURL: oldEmbed.author.icon_url })
        .setTitle(oldEmbed.title)
        .setFields([
            { name: oldEmbed.fields[0].name, value: oldEmbed.fields[0].value },
            { name: oldEmbed.fields[1].name, value: oldEmbed.fields[1].value },
            { name: "Claimed by", value: `${interaction.user}` },
        ])
        .setFooter({ text: "Ticket has been claimed. Do not delete this thread." })

        const newButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId('claimthread')
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
            new ButtonBuilder()
            .setCustomId('closethread')
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger),
        );

        // interaction.message.edit({ embeds: [newEmbed], components: [newButtons] })
        interaction.reply(`Thread claimed by ${interaction.user}!`)
        let currentTags = [];
        currentTags = interaction.channel.appliedTags
        const chosenTag = currentTags.filter(element => element === "1053882930088382565" || element === "1053886727963549696" || element === "1053882980852043798" || element === "1053883087639023666" || element === "1053883052826296371")
        interaction.channel.setAppliedTags(['1054117084566650910', chosenTag[0]])

    },
  };
  
