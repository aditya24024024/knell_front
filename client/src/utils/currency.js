export const CONVERSION_RATES = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095 };

export const getCurrencyFromLocale = () => {
  const locale = navigator.language || "en-IN";
  if (locale.startsWith("en-IN") || locale.startsWith("hi")) return { code: "INR", symbol: "₹" };
  if (locale.startsWith("en-GB")) return { code: "GBP", symbol: "£" };
  if (locale.startsWith("de") || locale.startsWith("fr") || locale.startsWith("it")) return { code: "EUR", symbol: "€" };
  return { code: "USD", symbol: "$" };
};

export const convertPrice = (priceInINR, currencyCode) => {
  return Math.round(priceInINR * CONVERSION_RATES[currencyCode]);
};