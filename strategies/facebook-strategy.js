const { Facebook } = require("../controllers/users");

const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
const facebookStrategy = new FacebookStrategy(
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
);

module.exports = facebookStrategy;
