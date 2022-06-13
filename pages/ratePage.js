const func = require("../api/api");

function ratePage(req, res) {
  func().then((d) => {
    let BTC = d.bitcoin.usd;
    let ETH = d.ethereum.usd;
    let LTC = d.litecoin.usd;
    let BNB = d.binancecoin.usd;
    res.render("rates", {
      btcvalue: BTC,
      ethvalue: ETH,
      ltcvalue: LTC,
    });
  });
}
module.exports = ratePage;
