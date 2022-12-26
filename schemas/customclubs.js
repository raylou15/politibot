const { mongoose, Schema, model } = require("mongoose");

const infractionSchema = new Schema({
  UserID: String,
  RoleID: String,
  ClubName: String,
  ClubChannel: String,
});

module.exports = model("customclubData", infractionSchema, "customclubs");

