const { EmbedBuilder } = require("discord.js");
const { execute } = require("./ready");

module.exports = {
  name: "threadCreate",
  async execute(thread, newlyCreated) {
    if (newlyCreated && thread.parent.id == "1129087976635388014") {
        const toPin = await thread.messages.fetch({ after: 0, limit: 1 })
        await toPin.first().pin()
    }
  },
};
