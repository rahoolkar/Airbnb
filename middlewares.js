const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Listing = require("./models/listing");

const validateSchema = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, "Please provide the required data. Thanks.");
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.previousPath = req.originalUrl;
    req.flash("error", "Please login and try again.");
    res.redirect("/login");
    return;
  }
  next();
};

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

const saveLastVisitedPath = (req, res, next) => {
  if (req.session.previousPath) {
    res.locals.lastVisitedPath = req.session.previousPath;
  }
  next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listingToCheck = await Listing.findById(id);
  if (!listingToCheck.owner.equals(res.locals.loggedInUser._id)) {
    req.flash("error", "You do not have the permission. Sorry.");
    res.redirect(`/listings/${id}`);
    return;
  }
  next();
};

module.exports = {
  isOwner,
  saveLastVisitedPath,
  validateReview,
  validateSchema,
  isLoggedIn,
};
