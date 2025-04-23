const { mongoose, Schema, model } = require("mongoose");

const blacklistSchema = new Schema({
  UserID: String,
});

module.exports = model("blacklistData", blacklistSchema, "blacklists");

