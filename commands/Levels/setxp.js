const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Embed,
    PermissionFlagsBits,
  } = require("discord.js");
const xp = require('simply-xp')
  const client = (module.exports = {
    data: new SlashCommandBuilder()
        .setName("setxp")
        .setDescription("setxp.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(options => options
            .setName('target')
            .setDescription('whom')
            .setRequired(true)    
        )
        .addNumberOption(options => options
            .setName("xp")
            .setDescription("Which xp?")
            .setRequired(true) 
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const level = interaction.options.getNumber("xp")
        const target = interaction.options.getUser("target")

        xp.setXP(target.id, interaction.guild.id, level)
        xp.lvlRole(interaction, target.id, guildID)

        interaction.reply({ content: `Done! Set ${target}'s XP to ${level}!`})

    },
});
  