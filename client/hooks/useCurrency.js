import { useState, useEffect } from "react";
import { getCurrencyFromLocale, convertPrice } from "../utils/currency";

export const useCurrency = () => {
  const [currency, setCurrency] = useState({ code: "INR", symbol: "₹" });

  useEffect(() => {
    setCurrency(getCurrencyFromLocale());
  }, []);

  const format = (priceInINR) => {
    const converted = convertPrice(priceInINR, currency.code);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return { currency, format };
};