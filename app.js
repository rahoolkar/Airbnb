const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const reviewRouter = require("./routes/review");
const listingRouter = require("./routes/listing");
const userRouter = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");

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
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());
require("./passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.listen(port, () => {
  console.log("app is running on port:", port);
});

app.get("/", (req, res) => {
  res.send("hi, i am root");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
