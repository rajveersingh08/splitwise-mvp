import { Router } from "express";
import balanceController from "../controllers/balance.controller";
import requestContext from "../middlewares/request-context.middleware";
import validate from "../middlewares/validate.middleware";
import { balanceQuerySchema } from "../validators/expense.validator";

const balanceRoutes = Router();

balanceRoutes.get(
  "/",
  requestContext,
  validate(balanceQuerySchema, "query"),
  balanceController.getBalances
);

export { balanceRoutes };
