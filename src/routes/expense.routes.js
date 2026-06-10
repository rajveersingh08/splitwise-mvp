import { Router } from "express";
import expenseController from "../controllers/expense.controller";
import requestContext from "../middlewares/request-context.middleware";
import validate from "../middlewares/validate.middleware";
import {
  expenseBodySchema,
  expenseIdParamSchema,
  listExpensesQuerySchema,
} from "../validators/expense.validator";

const expenseRoutes = Router();

expenseRoutes.use(requestContext);

expenseRoutes.post("/", validate(expenseBodySchema), expenseController.create);
expenseRoutes.get(
  "/",
  validate(listExpensesQuerySchema, "query"),
  expenseController.list
);
expenseRoutes.get(
  "/:expenseId",
  validate(expenseIdParamSchema, "params"),
  expenseController.get
);
expenseRoutes.put(
  "/:expenseId",
  validate(expenseIdParamSchema, "params"),
  validate(expenseBodySchema),
  expenseController.update
);
expenseRoutes.delete(
  "/:expenseId",
  validate(expenseIdParamSchema, "params"),
  expenseController.remove
);

export { expenseRoutes };
