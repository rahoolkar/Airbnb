const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingSchema = require("./schema");

const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, () => {
  console.log("app is running on port:", port);
});

app.get("/", (req, res) => {
  res.send("hi, i am root");
});

const validateSchema = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, "Please provide the required data. Thanks.");
  } else {
    next();
  }
};

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

app.post(
  "/listings",
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

app.put(
  "/listings/:id",
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

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

app.get("/error", (req, res) => {
  res.render("listings/error.ejs");
});

app.use("/", (req, res, next) => {
  throw new ExpressError(
    404,
    "Sorry, Something went wrong :( We are working on it.."
  );
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error :( Please wait" } =
    err;
  res.status(status).render("listings/error.ejs", { status, message });
});
