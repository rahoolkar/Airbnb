const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const newuser = new User({ email, username });
      await User.register(newuser, password);
      req.flash("success", "You are now logged in.");
      res.redirect("/listings");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

module.exports = router;
