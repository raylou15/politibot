const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, IntentsBitField } = require("discord.js");
const config = require("../../config.json")
const TicketCountSchema = require("../../schemas/ticketcount")
const ticketHandler = require("../../handlers/tickethandler")
const client = module.exports = {
    name: "contactreport",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction, client) {

        const message = interaction.message
        const embed = message.embeds[0]
        const regex = /<@(\d+)>/;

        const claimedModID = embed.fields[1].value.match(regex)
        const claimedMod = interaction.guild.members.cache.get(claimedModID[1])

        if (interaction.user !== claimedMod.user) {
            return interaction.reply({ephemeral: true, content: "This is not your report."})
        }

        const match = embed.description.match(regex)
        const targetUser = interaction.guild.members.cache.get(match[1]).user

        if (!targetUser) {
            return interaction.reply({ ephemeral: true, content: "The user who filed the report appears to have left the server." })
        }

        const notifEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          "The Operation Politics Staff has opened a ticket with you in response to a report you filed earlier. Please await a response below. \n\nYou can reply to staff or communicate with them by DMing this bot. A green checkmark reaction indicates that the message has been successfully sent, whereas a red cross reaction indicates that the message has failed and you should try again. \n\nPlease note that we prefer message links over screenshots of messages whenever applicable or possible, but we can see any screenshots or videos you send us through here."
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
        .setAuthor({ name: interaction.user.username })
        .setDescription(`A moderator has opened a ticket to contact ${targetUser}`)
        .setFields([
          { name: "Category", value: "Moderation" },
          {
            name: "Reason:",
            value: `First contact originated by ${interaction.user}.`,
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
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('takeover')
          .setLabel('❗')
          .setStyle(ButtonStyle.Secondary)
      );

      const memberDiscriminator1 = targetUser.username.replace("#", "-");
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
  };
  
