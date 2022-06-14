const { Facebook } = require("../controllers/users");

const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.facebook_app_id,
    clientSecret: process.env.facebook_app_secret,
    callbackURL: "http://localhost:8080/auth/facebook/deem-home",
    profileFields: [
      "id",
      "displayName",
      "picture.type(large)",
      "email",
      "birthday",
      "friends",
      "first_name",
      "last_name",
      "middle_name",
      "gender",
      "link",
    ],
  },
  function (accessToken, refreshToken, profile, cb) {
    const imageURL = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`;
    Facebook.findOne(
      {
        facebookId: profile.id,
        name: profile.displayName,
        username: profile.displayName,
      },
      function (err, user) {
        if (!err) {
          if (user) {
            return cb(err, user);
          } else {
            Facebook.create(
              {
                facebookId: profile.id,
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

module.exports = facebookStrategy;
