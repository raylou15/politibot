const { mongoose, Schema, model } = require("mongoose");

const newsLetterSchema = new Schema({
  GuildID: String,
  UserID: String,
  CNN: Boolean,
  Fox: Boolean,
  NyTimes: Boolean,
  TheHill: Boolean,
  NBCNews: Boolean,
  CBSNews: Boolean,
  POLITICO: Boolean,
  NPR: Boolean,
  APNews: Boolean,
  Reuters: Boolean,
  WashPost: Boolean,
  USAToday: Boolean,
  MorningNewsletter: Boolean,
  EveningNewsletter: Boolean
});

module.exports = model("newsletterData", newsLetterSchema, "newslettersubs");