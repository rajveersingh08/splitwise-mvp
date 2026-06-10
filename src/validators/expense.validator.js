import * as Yup from "yup";
import { SPLIT_TYPES } from "../constants/split-types";
import { currencySchema, optionalCurrencySchema, paginationSchema } from "./common.validator";

export const expenseBodySchema = Yup.object({
  name: Yup.string().trim().min(1).max(255).required(),
  totalAmount: Yup.number()
    .typeError("Total amount must be a number")
    .positive("Total amount must be greater than zero")
    .required(),
  currency: currencySchema.required(),
  expenseDate: Yup.string().required("Expense date is required"),
  paidByUserId: Yup.number()
    .integer()
    .positive()
    .required("Payer ID is required"),
  memberIds: Yup.array()
    .of(Yup.number().integer().positive().required())
    .min(1, "At least one member is required")
    .required(),
  splitType: Yup.string()
    .oneOf([SPLIT_TYPES.EQUAL], "Only equal split is supported in MVP")
    .default(SPLIT_TYPES.EQUAL),
});

function toNumber(_value, originalValue) {
  const parsed = Number(originalValue);
  return Number.isNaN(parsed) ? NaN : parsed;
}

export const expenseIdParamSchema = Yup.object({
  expenseId: Yup.number()
    .transform(toNumber)
    .typeError("Expense ID must be a number")
    .integer()
    .positive()
    .required(),
});

export const listExpensesQuerySchema = paginationSchema.shape({
  currency: optionalCurrencySchema,
  fromDate: Yup.string().optional(),
  toDate: Yup.string().optional(),
});

export const balanceQuerySchema = Yup.object({
  currency: optionalCurrencySchema,
});
