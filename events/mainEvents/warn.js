const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags
} = require("discord.js");

module.exports = {
    name: "warn",
    async execute(info, client) {
        const logChannel = await client.channels.fetch("895052490574270484");

        console.warn(`⚠️ Discord warning: ${info}`);

        const container = new ContainerBuilder()
            .setAccentColor([255, 255, 0])
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        `### ⚠️ BOT WARNING`,
                        '```ansi',
                        info.toString().slice(0, 1900), // Slice to avoid hitting message limit
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
