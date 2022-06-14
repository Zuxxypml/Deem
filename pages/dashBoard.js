const func = require("../api/api");
const { Local, Facebook, Google } = require("../controllers/users");

function dashBoard(req, res) {
  if (req.isAuthenticated()) {
    handleRequest(req.session.passport.user.userGroup, req, res);
  } else {
    res.redirect("/login");
  }
}
module.exports = dashBoard;

function handleRequest(param, req, res) {
  let userType = param;
  let dbType = Local;
  if (userType === "Local") {
    dbType = Local;
  } else if (userType === "Google") {
    dbType = Google;
  } else if (userType === "Facebook") {
    dbType = Facebook;
  }
  dbType.findOne({ _id: req.user.id }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        func().then((d) => {
          let BTC = d.bitcoin.usd,
            ETH = d.ethereum.usd,
            USDC = d["usd-coin"].usd,
            BCH = d["bitcoin-cash"].usd,
            DOGE = d.dogecoin.usd;

          res.render("deem-dashboard", {
            btcvalue: BTC,
            ethvalue: ETH,
            bchvalue: BCH,
            usdcvalue: USDC,
            dogevalue: DOGE,
            user: foundUser.name,
            imageURL: foundUser.imageURL,
          });
        });
      }
    } else return;
  });
}
