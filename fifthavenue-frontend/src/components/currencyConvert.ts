// import CurrencyConverter from "currency-converter-lt";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store.ts";
import { setExchangeRate } from "../redux/reducer/currencyReducer.ts";

// const currencies = [
//   { USD: "$" },
//   { EUR: "€" },
//   { GBP: "£" },
//   { JPY: "¥" },
//   { AUD: "A$" },
//   { CAD: "C$" },
//   { CHF: "Fr" },
//   { CNY: "¥" },
//   { SEK: "kr" },
//   { NZD: "NZ$" },
// ];

// export const currencyConvert = async (amount, from = "USD") => {
//   const { selectedCurrency, symbol } = useSelector((state) => state.currency);
//   const to = selectedCurrency;
//   if (from == to) {
//     return { amount, symbol };
//   } else {
//     console.log(
//       `Received parameters - amount: ${amount}, from: ${from}, to: ${to}`
//     );
//     if (!amount || !from || !to) {
//       return { error: "Amount, from currency, and to currency are required" };
//     }

//     const currencyConverter = new CurrencyConverter();

//     try {
//       const convertedAmount = await currencyConverter
//         .from(from)
//         .to(to)
//         .amount(Number(amount))
//         .convert();
//       return { amount: convertedAmount, symbol };
//     } catch (error) {
//       console.error("Error during currency conversion:", error);
//     }
//   }
// };

// export const currencyConvert = async (amount, from, to) => {
//   console.log(
//     `Received parameters - amount: ${amount}, from: ${from}, to: ${to}`
//   );
//   // Validate inputs
//   if (!amount || !from || !to) {
//     return { error: "Amount, from currency, and to currency are required" };
//   }

//   const currencyConverter = new CurrencyConverter();

//   try {
//     const convertedAmount = await currencyConverter
//       .from(from)
//       .to(to)
//       .amount(Number(amount))
//       .convert();
//     return { amount: convertedAmount };
//   } catch (error) {
//     console.error("Error during currency conversion:", error);
//   }
// };

export const currencyConvert = async (
  amount: number = 1,
  from: string = "USD"
) => {
  const dispatch = useDispatch();
  const { selectedCurrency } = useSelector(
    (state: RootState) => state.currency
  );
  const to = selectedCurrency;
  console.log(
    `Received parameters - amount: ${amount}, from: ${from}, to: ${to}`
  );
  // if (from == to) {
  //   return { amount,symbol };
  // }
  if (!amount || !from || !to) {
    return { error: "Amount, from currency, and to currency are required" };
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/convert?amount=${amount}&from=${from}&to=${to}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const exchangeRate = data.amount;
    setTimeout(() => {
      dispatch(setExchangeRate(exchangeRate));
    }, 10000);
    return data;
  } catch (error) {
    console.error("Error during currency conversion:", error);
    return { error: "Error during currency conversion" };
  }
};
