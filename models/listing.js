const mongoose = require("mongoose");
const Review = require("./review");
const { ref } = require("joi");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    set: (v) =>
      v === ""
        ? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
        : v,
  },
  country: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (deletedListing) => {
  if (deletedListing) {
    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
