import { Router } from "express";
import { balanceRoutes } from "./balance.routes";
import { expenseRoutes } from "./expense.routes";
import { userRoutes } from "./user.routes";

const apiRouter = Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/expenses", expenseRoutes);
apiRouter.use("/balances", balanceRoutes);

export { apiRouter };
