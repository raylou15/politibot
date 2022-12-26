const { mongoose, Schema, model } = require("mongoose");

const infractionSchema = new Schema({
  CaseID: Number,
  TargetID: String,
  IssuerID: String,
  InfractionType: String,
  Date: Date,
  Duration: String,
  Reason: String,
});

module.exports = model("infractionData", infractionSchema, "infractions");

// const data = new infractionModel({
//   _id: target.id,
//   UserTag: target.user.tag,
//   IssuerID: interaction.author.id,
//   IssuerTag: interaction.author.tag,
//   InfractionType: "Mute",
//   CaseNum: caseNumVal,
//   Reason: reason,
//   Date: Date.now(),
// });
