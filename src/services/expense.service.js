import { SPLIT_TYPES } from "../constants/split-types";
import expenseRepository from "../repositories/expense.repository";
import userRepository from "../repositories/user.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "../utils/ApiError";
import { normalizeCurrencyCode } from "../utils/currency";
import { toExpenseResponse } from "../utils/expense.mapper";
import { parseAmount, splitEqually } from "../utils/money";

async function buildExpensePayload(input) {
  const memberIds = input.memberIds.map(Number);
  const uniqueIds = [...new Set(memberIds)];

  if (uniqueIds.length !== memberIds.length) {
    throw new ValidationError("Duplicate members are not allowed");
  }

  const paidByUserId = Number(input.paidByUserId);
  if (!uniqueIds.includes(paidByUserId)) {
    throw new ValidationError("Payer must be included in members");
  }

  const existingCount = await userRepository.countByIds(uniqueIds);
  if (existingCount !== uniqueIds.length) {
    throw new NotFoundError("One or more members were not found");
  }

  const totalAmount = parseAmount(input.totalAmount);
  const shares = splitEqually(totalAmount, uniqueIds);

  return {
    expenseData: {
      name: input.name.trim(),
      total_amount: totalAmount,
      currency: normalizeCurrencyCode(input.currency),
      expense_date: input.expenseDate,
      split_type: SPLIT_TYPES.EQUAL,
      paid_by_user_id: paidByUserId,
    },
    participants: shares,
  };
}

function isCreator(expense, userId) {
  return Number(expense.created_by_user_id) === Number(userId);
}

const expenseService = {
  async createExpense(actorUserId, input) {
    const { expenseData, participants } = await buildExpensePayload(input);

    const expense = await expenseRepository.createWithParticipants(
      { ...expenseData, created_by_user_id: actorUserId },
      participants
    );

    return toExpenseResponse(await expenseRepository.findById(expense.id));
  },

  async listExpenses(userId, filters = {}) {
    const result = await expenseRepository.findAllForUser(userId, filters);
    return {
      data: result.data.map(toExpenseResponse),
      pagination: result.pagination,
    };
  },

  async getExpense(userId, expenseId) {
    const expense = await expenseRepository.findAccessibleById(expenseId, userId);
    if (!expense) throw new NotFoundError("Expense not found");
    return toExpenseResponse(expense);
  },

  async updateExpense(userId, expenseId, input) {
    const expense = await expenseRepository.findAccessibleById(expenseId, userId);
    if (!expense) throw new NotFoundError("Expense not found");
    if (!isCreator(expense, userId)) {
      throw new ForbiddenError("Only the expense creator can update this expense");
    }

    const { expenseData, participants } = await buildExpensePayload(input);
    await expenseRepository.updateWithParticipants(expense, expenseData, participants);

    return toExpenseResponse(await expenseRepository.findById(expense.id));
  },

  async deleteExpense(userId, expenseId) {
    const expense = await expenseRepository.findAccessibleById(expenseId, userId);
    if (!expense) throw new NotFoundError("Expense not found");
    if (!isCreator(expense, userId)) {
      throw new ForbiddenError("Only the expense creator can delete this expense");
    }

    await expenseRepository.delete(expense);
  },
};

export default expenseService;
