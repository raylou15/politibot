const {
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags
} = require("discord.js");

module.exports = {
    name: "error",
    async execute(info, client) {
        const logChannel = await client.channels.fetch("895052490574270484");

        console.error(`❌ Discord client error:`, info);

        const container = new ContainerBuilder()
            .setAccentColor([255, 0, 0])
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        `### ❌ BOT ERROR`,
                        '```ansi',
                        (info.stack || info.message || info.toString()).slice(0, 1900),
                        '```'
                    ].join('\n')
                )
            );

        await logChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2]
        });
    },
};
