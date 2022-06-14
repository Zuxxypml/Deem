//Creating Prerequisites
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const ratePage = require("./pages/ratePage");
const registerPage = require("./pages/registerPage");
const homePage = require(__dirname + "/pages/homePage.js");
const loginPage = require("./pages/loginPage");
const localLogin = require("./Auth/Local/LocalLogin");
const dashBoard = require("./pages/dashBoard");
const {
  btcRate,
  ethRate,
  ltcRate,
} = require("./calculators/coinRateCalculator");
const registerLocalUser = require("./Auth/Local/LocalRegistration");
require("./utils/passport");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 8080;
// Requests
// Homepage Handler
app.route("/").get(homePage);
// About Page
app.route("/about").get((req, res) => res.render("about"));
// Rate page
app.route("/rates").get(ratePage);
// Registeration handler
app
  .route("/register")
  .get(registerPage)
  .post(
    registerLocalUser,
    passport.authenticate("local", {
      successRedirect: "/deem-home",
      failureRedirect: "/login",
    })
  );
// Login Handler
app.route("/login").get(loginPage).post(localLogin);
// Logout
app.route("/logout").get((req, res) => {
  req.logOut();
  res.redirect("/login");
});
// Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/deem-home",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/deem-home")
);
// Facebook Auth
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/auth/facebook/deem-home",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/deem-home")
);
// Homepage Handler
app.route("/deem-home").get(dashBoard);
// BTC Calculator
app.route("/btccal").post(btcRate);
// Eth calculator
app.route("/ethcal").post(ethRate);
// Ltc Calculator
app.route("/ltccal").post(ltcRate);
const HOST = "0.0.0.0";
//Listener
app.listen(PORT, HOST, () => {
  console.log("Started server on port 8080");
});
