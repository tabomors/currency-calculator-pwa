"use strict";

const MONEY_EXCHANGE_API = "https://api.exchangeratesapi.io";

const latestDataWithUsdBase = `${MONEY_EXCHANGE_API}/latest?base=USD`;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(
    registration => {
      console.log('Service worker is installed!')
      registration.addEventListener('updatefound', event => {
        console.log('New service worker!!!');
        console.log(event);
      })
    },
    err => {

      console.error("ServiceWorker registration failed: ", err);
    }
  );
}

fetch(latestDataWithUsdBase)
  .then(res => res.json())
  .then(({ rates }) => {
    document.getElementById("exchangeForm").addEventListener("submit", e => {
      e.preventDefault();
      const fromValue = document.getElementById("fromCurrencyInput").value;
      const fromCurrency = document.getElementById("fromCurrencyDropdown")
        .value;
      const toCurrency = document.getElementById("toCurrencyDropdown").value;
      const exchangedMoney = exchangeMoney(
        fromValue,
        fromCurrency,
        toCurrency,
        rates
      );
      document.getElementById("toCurrencyInput").value = exchangedMoney;
    });
  });

function exchangeMoney(fromValue, fromCurrency, toCurrency, rates) {
  const baseValue = fromValue / rates[fromCurrency];
  const toValue = baseValue * rates[toCurrency];
  return toValue;
}
