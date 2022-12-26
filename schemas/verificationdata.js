const { mongoose, Schema, model } = require("mongoose");

const verifySchema = new Schema({
  UserID: String,
  attemptNum: Number,
  Age: String,
  StudentHub: String,
  QuestionProvided: Number,
  QuestionAnswerCorrect: Boolean,
  AgreePolicy: Boolean,
});

module.exports = model("verifyData", verifySchema, "verifications");
