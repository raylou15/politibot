const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const ticketHandler = require("../../handlers/tickethandler");
const config = require("../../config.json");
const TicketCountSchema = require("../../schemas/ticketcount");
const client = (module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Staff Ticket Commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand.setName("close").setDescription("Close an active ticket.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("claim").setDescription("Claim an active ticket.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("unclaim").setDescription("Unclaim an active ticket.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("contact")
        .setDescription("Open a ticket with a specific user")
        .addUserOption((options) =>
          options
            .setName("target")
            .setDescription("Who do you want to contact?")
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    // Contact Command
    if (interaction.options.getSubcommand() === "contact") {
      const targetUser = interaction.options.getUser("target");

      const notifEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          "The Operation Politics Staff has opened a ticket with you. Please await a response below."
        )
        .setFooter({
          text: "If you do not receive a response after a while, please feel free to let us know.",
        });

      const dmErrorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("This user does not have their DMs open.");

      await targetUser.send({ embeds: [notifEmbed] }).catch(async (err) => {
        console.log(err);
        return interaction.reply({ embeds: [dmErrorEmbed], ephemeral: true });
      });

      const ticketCount = await TicketCountSchema.find({
        _id: "63b9fb11264cc64866585953",
      });
      const ticketNum = ticketCount[0].TicketCount + 1;
      await TicketCountSchema.findOneAndUpdate({
        _id: "63b9fb11264cc64866585953",
        TicketCount: ticketNum,
      });

      const ticketPreview = new EmbedBuilder()
        .setColor("Green")
        .setTitle("New Ticket Opened")
        .setAuthor({ name: interaction.user.tag })
        .setDescription(`A new ticket has been opened by ${interaction.user}`)
        .setFields([
          { name: "Category", value: "Moderation" },
          {
            name: "Reason:",
            value: "First contact originated by a Moderator.",
            inline: true,
          },
          { name: "Claimed by:", value: "N/A", inline: true },
        ])
        .setFooter({ text: "Please claim the ticket before proceeding." });

      const ticketButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claimticket")
          .setLabel("Claim Ticket")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("closeticket")
          .setLabel("Close")
          .setStyle(ButtonStyle.Danger)
      );

      const memberDiscriminator1 = targetUser.tag.replace("#", "-");
      const memberDiscriminator = memberDiscriminator1.replace(" ", "_");
      const ticketName = `${memberDiscriminator}-${ticketNum}`;
      const ticketCat = "moderation";
      const ticketContact = true;

      ticketHandler.TicketCreate(
        client,
        ticketName,
        ticketCat,
        ticketPreview,
        ticketButtons,
        ticketContact,
        interaction
      );

      await interaction.reply({
        content: "A new ticket has been opened.",
        ephemeral: true,
      });
    }

    if (interaction.channel.parent.id !== config.ticketParent) {
      return interaction.reply({
        content: "This command must be used in an active ticket.",
        ephemeral: true,
      });
    }

    // Close Command
    if (interaction.options.getSubcommand() === "close") {
      const nameArgs = interaction.channel.name.split("-");
      const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`;
      const targetDiscrim = targetDiscrim1.replace("_", " ");
      const targetUser = client.users.cache.find(
        (u) => u.tag === targetDiscrim
      );

      const mainChannel = interaction.channel;
      const fetchmessages = await interaction.channel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const mainMessage = fetchmessages.first();
      const mainEmbed = mainMessage.embeds[0];

      const confirmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Are you sure you want to close this thread?");

      const confirmRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirmclose")
          .setLabel("Confirm")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("cancelclose")
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Danger)
      );

      const confirmMsg = await interaction.reply({
        embeds: [confirmEmbed],
        components: [confirmRow],
        fetchReply: true,
      });

      confirmMsg
        .awaitMessageComponent({
          time: 180000,
          filter: (i) => i.user.id === interaction.user.id,
        })
        .then(async (interaction) => {
          buttonClicked = interaction.customId;

          if (buttonClicked === "cancelclose") {
            return interaction.update({
              content: "Cancelled.",
              embeds: [],
              components: [],
            });
          }
          await mainMessage.edit({
            embeds: [mainMessage.embeds[0]],
            components: [],
          });

          const closeEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `Your ${mainEmbed.fields[0].value} ticket has been closed.`
            );

          await interaction.update({
            content: `This thread has been closed by ${interaction.user}.`,
            embeds: [],
            components: [],
          });
          await targetUser.send({ embeds: [closeEmbed] });
          await mainChannel.setArchived(true);
        })
        .catch((error) => {
          console.log(error);
          return prompt.edit({
            content: "Prompt likely timed out.",
            embeds: [],
            components: [],
          });
        });
    }

    // Claim Command
    if (interaction.options.getSubcommand() === "claim") {
      const mainchannel = interaction.channel;
      const fetchmessages = await interaction.channel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const mainMessage = fetchmessages.first();
      const mainEmbed = mainMessage.embeds[0];
      const nameArgs = mainchannel.name.split("-");
      const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`;
      const targetDiscrim = targetDiscrim1.replace("_", " ");
      const targetUser = client.users.cache.find(
        (u) => u.tag === targetDiscrim
      );
      const ticketsChannel = interaction.guild.channels.cache.get(
        config.ticketParent
      );

      await mainMessage.pin();

      const newEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("New Ticket Opened")
        .setAuthor(mainEmbed.author)
        .setDescription(mainEmbed.description)
        .setFields([
          { name: mainEmbed.fields[0].name, value: mainEmbed.fields[0].value },
          {
            name: mainEmbed.fields[1].name,
            value: mainEmbed.fields[1].value,
            inline: true,
          },
          {
            name: mainEmbed.fields[2].name,
            value: `${interaction.user}`,
            inline: true,
          },
        ])
        .setFooter({ text: "This ticket has been claimed." });

      const claimedEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`This ticket has been claimed by ${interaction.user}!`);

      const claimedEmbed2 = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          "Your ticket has been claimed and is now being reviewed."
        );

      const claimedButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("unclaimticket")
          .setLabel("Unclaim Ticket")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("closeticket")
          .setLabel("Close")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.reply({ embeds: [claimedEmbed] });
      await targetUser.send({ embeds: [claimedEmbed2] });
      await mainMessage.edit({
        embeds: [newEmbed],
        components: [claimedButtons],
      });

      const tagArray = [];

      ticketsChannel.availableTags.forEach((element) => {
        if (
          element.name.toLowerCase() ===
          `${mainEmbed.fields[0].value.toLowerCase()}`
        ) {
          tagArray.push(element.id);
        }
        if (element.name.toLowerCase() === `claimed`) {
          tagArray.push(element.id);
        }
      });

      mainchannel.setAppliedTags(tagArray);
    }

    // Unclaim Command
    if (interaction.options.getSubcommand() === "unclaim") {
      const mainchannel = interaction.channel;
      const fetchmessages = await interaction.channel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const mainMessage = fetchmessages.first();
      const mainEmbed = mainMessage.embeds[0];
      const nameArgs = mainchannel.name.split("-");
      const targetDiscrim1 = `${nameArgs[0]}#${nameArgs[1]}`;
      const targetDiscrim = targetDiscrim1.replace("_", " ");
      const targetUser = client.users.cache.find(
        (u) => u.tag === targetDiscrim
      );
      const ticketsChannel = interaction.guild.channels.cache.get(
        config.ticketParent
      );

      if (`<@${interaction.user.id}>` !== mainEmbed.fields[2].value) {
        console.log(mainEmbed.fields[2].value);
        return interaction.reply({
          content: "This is not your ticket!",
          ephemeral: true,
        });
      }

      const newEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("New Ticket Opened")
        .setAuthor(mainEmbed.author)
        .setDescription(mainEmbed.description)
        .setFields([
          { name: mainEmbed.fields[0].name, value: mainEmbed.fields[0].value },
          {
            name: mainEmbed.fields[1].name,
            value: mainEmbed.fields[1].value,
            inline: true,
          },
          { name: mainEmbed.fields[2].name, value: `N/A`, inline: true },
        ])
        .setFooter({ text: "Please claim the ticket before proceeding." });

      const claimedEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `This ticket has been unclaimed by ${interaction.user}!`
        );

      const claimedEmbed2 = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          "Your ticket has been unclaimed and is now awaiting a new staff member."
        );

      const claimedButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claimticket")
          .setLabel("Claim Ticket")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("closeticket")
          .setLabel("Close")
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.reply({ embeds: [claimedEmbed] });
      await targetUser.send({ embeds: [claimedEmbed2] });
      await mainMessage.edit({
        embeds: [newEmbed],
        components: [claimedButtons],
      });

      const tagArray = [];

      ticketsChannel.availableTags.forEach((element) => {
        if (
          element.name.toLowerCase() ===
          `${mainEmbed.fields[0].value.toLowerCase()}`
        ) {
          tagArray.push(element.id);
        }
        if (element.name.toLowerCase() === `unclaimed`) {
          tagArray.push(element.id);
        }
      });

      mainchannel.setAppliedTags(tagArray);
    }
  },
});
