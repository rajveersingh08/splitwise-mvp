import * as Yup from "yup";
import { isValidCurrency } from "../utils/currency";

export const currencySchema = Yup.string()
  .transform((value) => (typeof value === "string" ? value.trim().toUpperCase() : value))
  .test("is-valid-currency", "Invalid currency code", (value) =>
    value ? isValidCurrency(value) : false
  );

export const optionalCurrencySchema = Yup.string()
  .transform((value) => (typeof value === "string" ? value.trim().toUpperCase() : value))
  .test("is-valid-currency", "Invalid currency code", (value) =>
    value ? isValidCurrency(value) : true
  )
  .optional();

function toNumber(_value, originalValue) {
  if (originalValue === undefined || originalValue === null || originalValue === "") {
    return undefined;
  }

  const parsed = Number(originalValue);
  return Number.isNaN(parsed) ? NaN : parsed;
}

export const positiveIntegerIdSchema = Yup.number()
  .transform(toNumber)
  .typeError("ID must be a number")
  .integer("ID must be an integer")
  .positive("ID must be positive")
  .required("ID is required");

export const paginationSchema = Yup.object({
  page: Yup.number().transform(toNumber).integer().min(1).default(1),
  limit: Yup.number().transform(toNumber).integer().min(1).max(100).default(20),
});
