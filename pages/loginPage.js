function loginPage(req, res) {
  res.render("login", { errmsg: "" });
}
module.exports = loginPage;
