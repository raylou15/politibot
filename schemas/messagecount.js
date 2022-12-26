const { mongoose, Schema, model } = require("mongoose");

const messagecountSchema = new Schema({
  UserID: String,
  msgCount: Number,
});

module.exports = model("messagecountData", messagecountSchema, "messagecounts");