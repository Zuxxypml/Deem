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
    const imageURL = profile.photos[0].value;
    Google.findOne(
      {
        googleId: profile.id,
        name: profile.displayName,
        username: profile.displayName,
      },
      function (err, user) {
        if (!err) {
          if (user) {
            return cb(err, user);
          } else {
            Google.create(
              {
                googleId: profile.id,
                name: profile.displayName,
                username: profile.displayName,
                imageURL: imageURL,
              },
              (err, user) => {
                return cb(err, user);
              }
            );
          }
        }
      }
    );
  }
);

module.exports = MygoogleStrategy;
