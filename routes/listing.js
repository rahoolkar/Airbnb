const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateSchema } = require("../middlewares");

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Lisiting not found :(");
      res.status(400);
      res.redirect("/listings");
      return;
    }
    res.render("listings/show.ejs", { listing });
  })
);

router.post(
  "/",
  isLoggedIn,
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, country, location } = req.body;
    await Listing.findByIdAndUpdate(
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
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
