import { Op } from "sequelize";
import Expense from "../models/Expense";
import ExpenseParticipant from "../models/ExpenseParticipant";
import User from "../models/User";
import {
  createExpenseWithParticipants,
  updateExpenseWithParticipants,
  deleteExpense as deleteExpenseTransaction,
} from "../database/transactions/expense.transactions";

const includes = [
  {
    model: ExpenseParticipant,
    as: "participants",
    include: [{ model: User, as: "user", attributes: ["id", "email"] }],
  },
  { model: User, as: "creator", attributes: ["id", "email"] },
  { model: User, as: "payer", attributes: ["id", "email"] },
];

async function accessFilter(userId) {
  const rows = await ExpenseParticipant.findAll({
    attributes: ["expense_id"],
    where: { user_id: userId },
    raw: true,
  });

  const participantExpenseIds = rows.map((row) => row.expense_id);
  const conditions = [
    { created_by_user_id: userId },
    { paid_by_user_id: userId },
  ];

  if (participantExpenseIds.length) {
    conditions.push({ id: { [Op.in]: participantExpenseIds } });
  }

  return { [Op.or]: conditions };
}

const expenseRepository = {
  findById(expenseId, options = {}) {
    return Expense.findByPk(expenseId, { include: includes, ...options });
  },

  async findAccessibleById(expenseId, userId, options = {}) {
    return Expense.findOne({
      where: { id: expenseId, ...(await accessFilter(userId)) },
      include: includes,
      ...options,
    });
  },

  async findAllForUser(userId, { page = 1, limit = 20, currency, fromDate, toDate } = {}) {
    const where = { ...(await accessFilter(userId)) };

    if (currency) where.currency = currency;

    if (fromDate || toDate) {
      where.expense_date = {};
      if (fromDate) where.expense_date[Op.gte] = fromDate;
      if (toDate) where.expense_date[Op.lte] = toDate;
    }

    const offset = (page - 1) * limit;
    const { rows, count } = await Expense.findAndCountAll({
      where,
      include: includes,
      order: [["expense_date", "DESC"], ["id", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit) || 0,
      },
    };
  },

  createWithParticipants(expenseData, participants, transaction = null) {
    return createExpenseWithParticipants(expenseData, participants, transaction);
  },

  updateWithParticipants(expense, expenseData, participants, transaction = null) {
    return updateExpenseWithParticipants(expense, expenseData, participants, transaction);
  },

  delete(expense, transaction = null) {
    return deleteExpenseTransaction(expense, transaction);
  },
};

export default expenseRepository;
