const passport = require("passport");

function localLogin(req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
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
}
module.exports = localLogin;
