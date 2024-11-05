import CurrencyConverter from "currency-converter-lt";
import { TryCatch } from "../middlewares/error.js";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "Fr." },
  { code: "CNY", symbol: "¥" },
  { code: "SEK", symbol: "kr" },
  { code: "NZD", symbol: "NZ$" },
  { code: "INR", symbol: "₹" },
  { code: "RUB", symbol: "₽" },
  { code: "BRL", symbol: "R$" },
  { code: "ZAR", symbol: "R" },
  { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "NOK", symbol: "kr" },
  { code: "MXN", symbol: "Mex$" },
  { code: "TRY", symbol: "₺" },
];
export const convert = TryCatch(async (req, res, next) => {
  const { amount, from, to } = req.query;

  if (!amount || !from || !to) {
    return res
      .status(400)
      .json({ error: "Amount, from currency, and to currency are required" });
  }

  const currencyConverter = new CurrencyConverter();

  try {
    const convertedAmount = await currencyConverter
      .from(from)
      .to(to)
      .amount(Number(amount))
      .convert();

    const targetCurrency = currencies.find((currency) => currency.code === to);
    const symbol = targetCurrency ? targetCurrency.symbol : "";
    res.json({ symbol, amount: convertedAmount });
  } catch (error) {
    console.error("Error during currency conversion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
