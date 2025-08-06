const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');

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
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));

app.listen(port, () => {
  console.log("app is running on port:", port);
});

app.get("/", (req, res) => {
  res.send("hi, i am root");
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

app.post("/listings", async (req, res) => {
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
});

app.put("/listings/:id", async (req, res) => {
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
});

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.get("/error",(req,res)=>{
  res.render("listings/error.ejs");
})
