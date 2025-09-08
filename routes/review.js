const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { postReview, deleteReview } = require("../controllers/reviews");

const { validateReview, isLoggedIn } = require("../middlewares");

router.post("/", validateReview, wrapAsync(postReview));

router.delete("/:rid", isLoggedIn, wrapAsync(deleteReview));

module.exports = router;
