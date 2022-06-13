const func = require("../api/api");

function dashBoard(req, res) {
  if (req.isAuthenticated()) {
    func().then((d) => {
      let { BTC, ETH, LTC, BNB, USDC, RPE, BCH, TTH, DOGE, TRON } = coins();

      res.render("deem-dashboard", {
        btcvalue: BTC,
        ethvalue: ETH,
        bchvalue: BCH,
        usdcvalue: USDC,
        dogevalue: DOGE,
      });

      function coins() {
        let BTC = d.bitcoin.usd,
          ETH = d.ethereum.usd,
          LTC = d.litecoin.usd,
          BNB = d.binancecoin.usd,
          USDC = d["usd-coin"].usd,
          RPE = d.ripple.usd,
          BCH = d["bitcoin-cash"].usd,
          TTH = d.tether.usd,
          DOGE = d.dogecoin.usd,
          TRON = d.tron.usd;
        return { BTC, ETH, LTC, BNB, USDC, RPE, BCH, TTH, DOGE, TRON };
      }
    });
  } else {
    res.redirect("/login");
  }
}
module.exports = dashBoard;
