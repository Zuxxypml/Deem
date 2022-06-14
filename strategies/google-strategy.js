const { Google } = require("../controllers/users");

require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MygoogleStrategy = new GoogleStrategy(
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
);

module.exports = MygoogleStrategy;
