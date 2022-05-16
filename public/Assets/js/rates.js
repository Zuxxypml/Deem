/**
 * Preloader
 */
let preloader = document.querySelector("#preloader");
if (preloader) {
  window.onload = () => {
    preloader.remove();
    console.log("done.");
  };
}
function checkBTC() {
  var useramt = document.getElementById("quantity").value;
  var btcrate = document.getElementById("mainbtcRate").value;

  let divideRates = parseInt(useramt) / parseInt(btcrate);
  let divideRate = divideRates.toFixed(8);

  URL = "/btccal";
  $.ajax({
    type: "POST",
    url: URL,
    data: { amount: useramt },
    success: function (data) {
      if (data !== 0) {
        document.querySelector(".changeborder").style.border =
          "solid 2px #ff4d02";
        var { thesrate } = data;
        var calc = thesrate * useramt;
        var calc2 = new Intl.NumberFormat("en-US").format(calc);
        // price(ourrate),show_amount(naira)
        document.getElementById("divide_amount").value = divideRate;
        document.getElementById("price").value = thesrate;
        document.getElementById("show_amount").value = calc2;
      }
    },
  });
}
function checkETH() {
  var useramt = document.getElementById("quantity2").value;
  var ethrate = document.getElementById("ethRate").value;

  let divideRates = parseInt(useramt) / parseInt(ethrate);
  let divideRate = divideRates.toFixed(8);

  URL = "/ethcal";
  $.ajax({
    type: "POST",
    url: URL,
    data: { amount: useramt },
    success: function (data) {
      if (data !== 0) {
        document.querySelector(".changebordereth").style.border =
          "solid 2px #ff4d02";
        var { thesrate } = data;
        var calc = thesrate * useramt;
        var calc2 = new Intl.NumberFormat("en-US").format(calc);
        // price(ourrate),show_amount(naira)
        document.getElementById("divide_amountEth").value = divideRate;
        document.getElementById("priceEth").value = thesrate;
        document.getElementById("show_amountEth").value = calc2;
      }
    },
  });
}
function checkLTC() {
  var useramt = document.getElementById("quantity3").value;
  var ltcrate = document.getElementById("ltcRate").value;

  let divideRates = parseInt(useramt) / parseInt(ltcrate);
  let divideRate = divideRates.toFixed(8);

  URL = "/ltccal";
  $.ajax({
    type: "POST",
    url: URL,
    data: { amount: useramt },
    success: function (data) {
      if (data !== 0) {
        document.querySelector(".changeborderltc").style.border =
          "solid 2px #ff4d02";
        var { thesrate } = data;
        var calc = thesrate * useramt;
        var calc2 = new Intl.NumberFormat("en-US").format(calc);
        // price(ourrate),show_amount(naira)
        document.getElementById("divide_amountLtc").value = divideRate;
        document.getElementById("priceLtc").value = thesrate;
        document.getElementById("show_amountLtc").value = calc2;
      }
    },
  });
}
