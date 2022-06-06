const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
var func = async () => {
  let Data = await CoinGeckoClient.simple.price({
    ids: [
      "bitcoin",
      "ethereum",
      "litecoin",
      "binancecoin",
      "bitcoin-cash",
      "usd-coin",
      "dogecoin",
      "ripple",
      "tether",
      "tron",
    ],
    vs_currencies: ["usd"],
  });
  return Data.data;
};
func();
module.exports = func;
