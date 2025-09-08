const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveLastVisitedPath } = require("../middlewares");
const {
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  getLogout,
} = require("../controllers/user");

router.get("/signup", getSignup);

router.post("/signup", wrapAsync(postSignup));

router.get("/login", getLogin);

router.post(
  "/login",
  saveLastVisitedPath,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  postLogin
);

router.get("/logout", getLogout);

module.exports = router;
