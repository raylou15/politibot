const { mongoose, Schema, model } = require("mongoose");

const infractionSchema = new Schema({
  UserID: String,
  RoleID: String,
});

module.exports = model("customrolesData", infractionSchema, "customroles");
