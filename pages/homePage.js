const func = require("../api/api");
function homePage(req, res) {
  func().then((d) => {
    console.log(d);
    let { BTC, ETH, LTC, BNB, USDC, RPE, BCH, TTH, DOGE, TRON } = coins();

    res.render("index", {
      btcvalue: BTC,
      ethvalue: ETH,
      ltcvalue: LTC,
      bnbvalue: BNB,
      bchvalue: BCH,
      rpevalue: RPE,
      usdcvalue: USDC,
      tthvalue: TTH,
      dogevalue: DOGE,
      tronvalue: TRON,
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
}
module.exports = homePage;
