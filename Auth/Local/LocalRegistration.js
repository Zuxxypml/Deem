const { Local } = require("../../controllers/users");
const passport = require("passport");
function registerLocalUser(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.pass;
  Local.register(
    // saves email as username
    { username: email, name: username },
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
    }
  );
}
module.exports = registerLocalUser;
