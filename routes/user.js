const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveLastVisitedPath } = require("../middlewares");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const newuser = new User({ email, username });
      const registeredUser = await User.register(newuser, password);
      req.login(registeredUser, (error) => {
        if (error) {
          return next(error);
        }
        req.flash("success", "You are now logged in.");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveLastVisitedPath,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    if (res.locals.lastVisitedPath) {
      res.redirect(res.locals.lastVisitedPath);
    } else {
      res.redirect("/listings");
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
