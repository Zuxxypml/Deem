function registerPage(req, res) {
  res.render("register", { errmsg: "" });
}
module.exports = registerPage;
