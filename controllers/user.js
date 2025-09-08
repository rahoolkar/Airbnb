const User = require("../models/user");

module.exports.getSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
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
};

module.exports.getLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLogin = (req, res) => {
  req.flash("success", "Welcome back!");
  if (res.locals.lastVisitedPath) {
    res.redirect(res.locals.lastVisitedPath);
  } else {
    res.redirect("/listings");
  }
};

module.exports.getLogout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
};
