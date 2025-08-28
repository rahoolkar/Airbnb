const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(
      400,
      "Please provide a valid comment and ratings, Thanks."
    );
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { comment, rating } = req.body;
    let newReview = new Review({
      comment: comment,
      rating: rating,
    });
    let reviewSaved = await newReview.save();
    listing.reviews.push(reviewSaved);
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:rid",
  wrapAsync(async (req, res) => {
    let { lid, rid } = req.params;
    await Listing.findByIdAndUpdate(lid, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${lid}`);
  })
);

module.exports = router;
