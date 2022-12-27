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
        .setName("rankadd")
        .setDescription("Add a rank to the bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(options => options
            .setName("role")
            .setDescription("Which rank?")
            .setRequired(true)
        )
        .addNumberOption(options => options
            .setName("level")
            .setDescription("Which level?")
            .setRequired(true) 
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const role = interaction.options.getRole("role")
        const level = interaction.options.getNumber("level")

        xp.roleSetup.add(client, interaction.guild.id, {
            level: level,
            role: role.id
        });

        interaction.reply({ content: "Done!", ephemeral: true })

    },
});
  