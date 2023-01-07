const { IntegrationExpireBehavior } = require("discord.js");
const { model, Schema } = require("mongoose");

module.exports = model(
  "Ticket Counter",
  new Schema({
    TicketCount: Number,
  })
);
