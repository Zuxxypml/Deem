const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
var func = async () => {
  let Data = await CoinGeckoClient.simple.price({
    ids: ["bitcoin", "ethereum", "litecoin", "binancecoin", "bitcoincash"],
    vs_currencies: ["usd"],
  });
  //   console.log(Data.data);
  return Data.data;
};
func();
module.exports = func;
