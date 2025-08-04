const mongoose = require("mongoose");

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
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
