const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");

const validateSchema = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, "Please provide the required data. Thanks.");
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  validateSchema,
  wrapAsync(async (req, res) => {
    let { title, description, price, image, country, location } = req.body;
    let newListing = new Listing({
      title,
      description,
      price,
      image,
      country,
      location,
    });
    await newListing.save();
    res.redirect("/listings");
  })
);

router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, country, location } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        country,
        image,
        location,
      },
      { new: true, runValidators: true }
    );
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
