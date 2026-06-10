import * as Yup from "yup";
import { DEFAULT_CURRENCY } from "../constants/currencies";
import { currencySchema, positiveIntegerIdSchema } from "./common.validator";

export const userIdParamSchema = Yup.object({
  id: positiveIntegerIdSchema,
});

export const registerSchema = Yup.object({
  email: Yup.string().email("A valid email is required").required(),
  password: Yup.string().min(8, "Password must be at least 8 characters").required(),
  defaultCurrency: currencySchema.default(DEFAULT_CURRENCY),
});

export const loginSchema = Yup.object({
  email: Yup.string().email("A valid email is required").required(),
  password: Yup.string().required("Password is required"),
});

export const updateProfileSchema = Yup.object({
  email: Yup.string().email("A valid email is required").optional(),
  defaultCurrency: currencySchema.optional(),
})
  .test(
    "at-least-one-field",
    "At least one field must be provided to update",
    (value) => Boolean(value?.email || value?.defaultCurrency)
  );
