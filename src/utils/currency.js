import { COMMON_CURRENCIES } from "../constants/currencies";

export function normalizeCurrencyCode(currency) {
  if (typeof currency !== "string") return null;
  return currency.trim().toUpperCase();
}

export function isValidCurrency(currency) {
  const code = normalizeCurrencyCode(currency);
  if (!code || !/^[A-Z]{3}$/.test(code)) return false;
  return COMMON_CURRENCIES.has(code);
}
