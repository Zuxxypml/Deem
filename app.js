//Creating Prerequisites
require("dotenv").config();
const chromeLauncher = require("chrome-launcher");
const express = require("express");
const CoinGecko = require("coingecko-api");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { Google, Facebook, Local } = require(__dirname + "/controllers/users");
const Data = require(__dirname + "/api/api.js");
const app = express();
const CoinGeckoClient = new CoinGecko();
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

// Requests
// Homepage Handler
app.route("/").get((req, res) => {
  Data().then((d) => {
    let BTC = d.bitcoin.usd;
    let ETH = d.ethereum.usd;
    let LTC = d.litecoin.usd;
    let BNB = d.binancecoin.usd;
    res.render("index", {
      btcvalue: BTC,
      ethvalue: ETH,
      ltcvalue: LTC,
      bnbvalue: BNB,
    });
  });
});
// About Page
app.route("/about").get((req, res) => {
  res.render("about");
});
// Rate page
app.route("/rates").get((req, res) => {
  res.render("rates");
});
// Registeration handler
app
  .route("/register")
  .get((req, res) => {
    res.render("register", { errmsg: "" });
  })
  .post(
    (req, res, next) => {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.pass;
      Local.register(
        // saves email as username
        { username: email, email: username },
        password,
        function (err, user) {
          if (err) {
            console.log(err);
            res.render("register", {
              errmsg: "A User with the given username or email exists",
            });
          } else if (!err) {
            next();
          }

          // go to the next middleware
        }
      );
    },
    passport.authenticate("local", {
      successRedirect: "/deem-home",
      failureRedirect: "/login",
    })
  );
// Login Handler
app
  .route("/login")
  .get((req, res) => {
    res.render("login", { errmsg: "" });
  })
  .post((req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        // *** Display message without using flash option
        // re-render the login form with a message
        return res.render("login", { errmsg: "Incorrect email or password" });
      }
      req.logIn(user, function (err) {
        if (err) {
          // return next(err);
          console.log(err);
          res.render("login", { errmsg: "Incorrect email or password" });
        }
        return res.redirect("/deem-home");
      });
    })(req, res, next);
  });

// Homepage Handler
app.route("/deem-home").get((req, res) => {
  if (req.isAuthenticated()) {
    res.render("deem-home");
  } else {
    res.redirect("/login");
  }
});
const HOST = "0.0.0.0";
//Listener
app.listen(PORT, HOST, () => {
  chromeLauncher
    .launch({
      startingUrl: `http://localhost:${PORT}`,
    })
    .then((chrome) => {
      console.log(`Chrome debugging port running on ${chrome.port}`);
    });
});
