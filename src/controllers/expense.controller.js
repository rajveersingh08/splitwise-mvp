import expenseService from "../services/expense.service";
import asyncHandler from "../utils/async-handler";

const expenseController = {
  create: asyncHandler(async (req, res) => {
    const expense = await expenseService.createExpense(req.userId, req.body);
    res.status(201).json(expense);
  }),

  list: asyncHandler(async (req, res) => {
    const result = await expenseService.listExpenses(req.userId, req.query);
    res.json(result);
  }),

  get: asyncHandler(async (req, res) => {
    const expense = await expenseService.getExpense(req.userId, req.params.expenseId);
    res.json(expense);
  }),

  update: asyncHandler(async (req, res) => {
    const expense = await expenseService.updateExpense(
      req.userId,
      req.params.expenseId,
      req.body
    );
    res.json(expense);
  }),

  remove: asyncHandler(async (req, res) => {
    await expenseService.deleteExpense(req.userId, req.params.expenseId);
    res.status(204).send();
  }),
};

export default expenseController;
