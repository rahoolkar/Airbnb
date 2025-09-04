const { ref } = require("joi");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Please add a comment :("],
    minlength: 3,
    maxlength: 50,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please give us a rating from 1-5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
