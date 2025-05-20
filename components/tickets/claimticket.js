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
  name: "claimticket",

  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction, client) {
    const mainchannel = interaction.channel;
    const mainEmbed = interaction.message.embeds[0];

    const nameArgs = mainchannel.name.split("-");
    const targetDiscrim = nameArgs[0].replace("_", " ");

    let targetUser = client.users.cache.find(u => u.username === targetDiscrim);
    if (!targetUser) {
      try {
        const guildMembers = await interaction.guild.members.fetch();
        targetUser = guildMembers.find(m => m.user.username === targetDiscrim)?.user;
      } catch (err) {
        console.error("❌ Failed to find target user:", err);
      }
    }

    const ticketsChannel = interaction.guild.channels.cache.get(config.ticketParent);
    await interaction.message.pin();

    // Null-safe field access
    const field0 = mainEmbed?.fields?.[0];
    const field1 = mainEmbed?.fields?.[1];
    const field2 = mainEmbed?.fields?.[2];

    const newEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("New Ticket Opened")
      .setAuthor(mainEmbed.author)
      .setDescription(mainEmbed.description)
      .setFields([
        { name: field0?.name ?? "Category", value: field0?.value ?? "Unknown" },
        { name: field1?.name ?? "Type", value: field1?.value ?? "Unknown", inline: true },
        { name: field2?.name ?? "Claimed By", value: `${interaction.user}`, inline: true }
      ])
      .setFooter({ text: "This ticket has been claimed." });

    const claimedEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(`This ticket has been claimed by ${interaction.user}!`);

    const claimedEmbed2 = new EmbedBuilder()
      .setColor("Green")
      .setDescription("Your ticket has been claimed and is now being reviewed.");

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

    // Safer reply logic
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ embeds: [claimedEmbed] });
    } else {
      await interaction.followUp({ embeds: [claimedEmbed], flags: [MessageFlags.Ephemeral] });
    }

    await interaction.message.edit({ embeds: [newEmbed], components: [claimedButtons] });

    // Safe tag assignment
    const tagArray = [];
    const categoryTag = field0?.value?.toLowerCase();

    ticketsChannel.availableTags.forEach(tag => {
      if (categoryTag && tag.name.toLowerCase() === categoryTag) {
        tagArray.push(tag.id);
      }
      if (tag.name.toLowerCase() === "claimed") {
        tagArray.push(tag.id);
      }
    });

    await mainchannel.setAppliedTags(tagArray);

    // DM logic
    console.log(targetUser);
    if (targetUser) {
      await targetUser.send({ embeds: [claimedEmbed2] }).catch(err => {
        console.warn("⚠️ Could not DM user:", err.message);
      });
    } else {
      console.warn("⚠️ targetUser is undefined — DM not sent.");
    }
  }
};
