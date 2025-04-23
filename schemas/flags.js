const { mongoose, Schema, model } = require("mongoose");

const flagSchema = new Schema({
  TargetID: String,
  FlagType: String,
});

module.exports = model("flagData", flagSchema, "flags");
