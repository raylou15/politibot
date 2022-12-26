const { EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { execute } = require("./ready");
const moment = require("moment");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldMember, newMember) {
    
    if (oldMember.channel !== newMember.channel) {
        
        const vc = oldMember.channel

        if (vc.members.size < 1) {
            if (vc.name[0] === "⭐") {
                return vc.delete()
            }
        }

    } else {
        return
    }

  },
};
