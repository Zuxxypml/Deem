function btcRate(req, res) {
  const rate = 570;
  res.json({ thesrate: rate });
}
function ethRate(req, res) {
  const rate = 550;
  res.json({ thesrate: rate });
}
function ltcRate(req, res) {
  const rate = 500;
  res.json({ thesrate: rate });
}

module.exports = {
  btcRate,
  ethRate,
  ltcRate,
};
