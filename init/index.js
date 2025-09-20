const mongoose = require("mongoose");
const data = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = process.env.ATLASDB_LINK;

main()
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb+srv://rahul-kar:3KUsvXwVXfKhZIED@cluster0.6btnnwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

async function initDB() {
  await Listing.deleteMany({});
  const newListingData = data.data.map((obj) => {
    return { ...obj, owner: "68b82d40a3fd1cd71dc3ce7d" };
  });
  await Listing.insertMany(newListingData);
}

initDB();
