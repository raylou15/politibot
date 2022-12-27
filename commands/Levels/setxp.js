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

        xp.setXP(interaction.user.id, interaction.guild.id, level)

        interaction.reply({ content: "Done!", ephemeral: true })

    },
});
  