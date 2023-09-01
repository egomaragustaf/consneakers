import currency from "currency.js";

  export function currencyToIDR(value: any) {
    return currency(value, {
      symbol: "Rp ",
      decimal: ",",
      separator: ".",
      precision: 0,
    });
  }

  export const formatValueToCurrency = (value: number | null | undefined) => {
    return currencyToIDR(value).format();
  };