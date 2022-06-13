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
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const loginPage = require("./pages/loginPage");
const localLogin = require("./Auth/Local/LocalLogin");
const dashBoard = require("./pages/dashBoard");
const {
  btcRate,
  ethRate,
  ltcRate,
} = require("./calculators/coinRateCalculator");
const registerLocalUser = require("./Auth/Local/LocalRegistration");
const { Google, Facebook, Local } = require(__dirname + "/controllers/users");
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

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}
// Serialisation for Local Users
passport.use(Local.createStrategy());
// used to serialize the user for the session
passport.serializeUser(function (userObject, done) {
  let userGroup = "Local";
  let userPrototype = Object.getPrototypeOf(userObject);
  if (userPrototype === Local.prototype) {
    userGroup = "Local";
  } else if (userPrototype === Google.prototype) {
    userGroup = "Google";
  } else if (userPrototype === Facebook.prototype) {
    userGroup = "Facebook";
  }
  let sessionContructor = new SessionConstructor(userObject.id, userGroup, "");
  done(null, sessionContructor);
});
// deserialize the user
passport.deserializeUser(function (sessionContructor, done) {
  if (sessionContructor.userGroup === "Local") {
    Local.findById({ _id: sessionContructor.userId }, function (err, user) {
      done(err, user);
    });
  } else if (sessionContructor.userGroup === "Google") {
    Google.findById({ _id: sessionContructor.userId }, function (err, user) {
      done(err, user);
    });
  } else if (sessionContructor.userGroup === "Facebook") {
    Facebook.findById({ _id: sessionContructor.userId }, function (err, user) {
      done(err, user);
    });
  }
});

// Strategies
// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.google_client_id,
      clientSecret: process.env.google_client_secret,
      callbackURL: "http://localhost:8080/auth/google/deem-home",
    },
    function (accessToken, refreshToken, profile, cb) {
      Google.findOrCreate(
        {
          googleId: profile.id,
          username: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.facebook_app_id,
      clientSecret: process.env.facebook_app_secret,
      callbackURL: "http://localhost:8080/auth/facebook/deem-home",
    },
    function (accessToken, refreshToken, profile, cb) {
      Facebook.findOrCreate(
        {
          facebookId: profile.id,
          username: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
// Requests
// Homepage Handler
app.route("/").get(homePage);
// About Page
app.route("/about").get((req, res) => {
  res.render("about");
});
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
