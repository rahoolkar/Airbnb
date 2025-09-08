const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateSchema } = require("../middlewares");
const {
  indexListings,
  getNew,
  getEdit,
  getId,
  postListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router.get("/new", isLoggedIn, getNew);

router.get("/", wrapAsync(indexListings));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(getEdit));

router.get("/:id", wrapAsync(getId));

router.post(
  "/",
  isLoggedIn,
  validateSchema,
  upload.single("image"),
  wrapAsync(postListing)
);

router.put("/:id", isLoggedIn, isOwner, wrapAsync(updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
