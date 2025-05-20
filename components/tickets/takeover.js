const {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

const config = require("../../config.json");

const client = module.exports = {
  name: "takeover",

  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction, client) {
    const isSenior =
      interaction.member.roles.cache.some(role => role.name === "Senior Moderator") ||
      interaction.member.roles.cache.some(role => role.name === "Management");

    if (!isSenior) {
      return await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "Only Senior Moderators or Management can override a claimed ticket."
      });
    }

    const mainchannel = interaction.channel;
    const mainEmbed = interaction.message.embeds[0];

    const nameArgs = mainchannel.name.split("-");
    const targetDiscrim = nameArgs[0]?.replace("_", " ");
    let targetUser = client.users.cache.find(u => u.username === targetDiscrim);

    if (!targetUser) {
      try {
        const guildMembers = await interaction.guild.members.fetch();
        targetUser = guildMembers.find(m => m.user.username === targetDiscrim)?.user;
      } catch (err) {
        console.error("❌ Failed to find target user:", err);
      }
    }

    const claimField = mainEmbed?.fields?.[2]?.value ?? "N/A";
    if (claimField === "N/A") {
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: "This ticket is not currently claimed by anybody, so you cannot override it."
      });
    }

    const ticketsChannel = interaction.guild.channels.cache.get(config.ticketParent);
    await interaction.message.pin();

    const newEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("New Ticket Opened")
      .setAuthor(mainEmbed.author)
      .setDescription(mainEmbed.description)
      .setFields([
        { name: mainEmbed.fields[0].name, value: mainEmbed.fields[0].value },
        { name: mainEmbed.fields[1].name, value: mainEmbed.fields[1].value, inline: true },
        { name: mainEmbed.fields[2].name, value: `${interaction.user}`, inline: true }
      ])
      .setFooter({ text: "This ticket has been claimed." });

    const claimedEmbed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(`This ticket has been overridden by ${interaction.user}!`);

    const claimedEmbed2 = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription("Your ticket has been re-claimed by a senior member of our staff.");

    const claimedButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("unclaimticket")
        .setLabel("Unclaim Ticket")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("closeticket")
        .setLabel("Close")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("takeover")
        .setLabel("❗")
        .setStyle(ButtonStyle.Secondary)
    );

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ embeds: [claimedEmbed] });
    } else {
      await interaction.followUp({ embeds: [claimedEmbed], flags: [MessageFlags.Ephemeral] });
    }

    if (targetUser) {
      await targetUser.send({ embeds: [claimedEmbed2] }).catch(err => {
        console.warn("⚠️ Could not DM user:", err.message);
      });
    } else {
      console.warn("⚠️ targetUser is undefined — DM not sent.");
    }

    await interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] });

    const tagArray = [];
    const categoryTag = mainEmbed?.fields?.[0]?.value?.toLowerCase();

    ticketsChannel.availableTags.forEach(tag => {
      if (categoryTag && tag.name.toLowerCase() === categoryTag) {
        tagArray.push(tag.id);
      }
      if (tag.name.toLowerCase() === "claimed") {
        tagArray.push(tag.id);
      }
    });

    await mainchannel.setAppliedTags(tagArray);
  }
};
