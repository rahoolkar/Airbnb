const Listing = require("../models/listing");
const { cloudinary } = require("../cloudinary");

module.exports.indexListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.getNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.getEdit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
};

module.exports.getId = async (req, res) => {
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
};

module.exports.postListing = async (req, res) => {
  let { title, description, price, image, country, location } = req.body;
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "airbnb_uploads",
  });
  let newListing = new Listing({
    title,
    description,
    price,
    country,
    location,
  });
  newListing.owner = req.user._id;
  newListing.image = result.secure_url;
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
