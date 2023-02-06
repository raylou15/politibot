const { mongoose, Schema, model } = require("mongoose");

const feedbackSchema = new Schema({
    UserID: String,
    Comments: Array,
    Ratings: Array,
});

module.exports = model("feedbackData", feedbackSchema, "feedbackData");