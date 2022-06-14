const passport = require("passport");
const MygoogleStrategy = require("../strategies/google-strategy");
const facebookStrategy = require("../strategies/facebook-strategy");
const { Google, Local, Facebook } = require("../controllers/users");

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
passport.use("google", MygoogleStrategy);
// Facebook Strategy
passport.use("facebook", facebookStrategy);
