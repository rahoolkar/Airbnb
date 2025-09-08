const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.postReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let { comment, rating } = req.body;
  let newReview = new Review({
    comment: comment,
    rating: rating,
  });
  newReview.author = req.user._id;
  let reviewSaved = await newReview.save();
  listing.reviews.push(reviewSaved);
  await listing.save();
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, rid } = req.params;
  let reviewToHandle = await Review.findById(rid);
  if (!reviewToHandle.author.equals(req.user._id)) {
    req.flash("error", "Your are not permitted to do this");
    return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
  await Review.findByIdAndDelete(rid);
  res.redirect(`/listings/${id}`);
};
