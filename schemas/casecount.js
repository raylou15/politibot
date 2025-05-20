const {
  IntegrationExpireBehavior,
  MessageFlags
} = require("discord.js");
const { model, Schema } = require("mongoose");

module.exports = model(
  "Case Counter",
  new Schema({
    CaseCount: Number,
  })
);
