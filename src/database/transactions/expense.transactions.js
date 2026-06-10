import Expense from "../../models/Expense";
import ExpenseParticipant from "../../models/ExpenseParticipant";
import { runInTransaction } from "../../utils/transaction";

export async function createExpenseWithParticipants(expenseData, participants, transaction = null) {
  return runInTransaction(transaction, async (t) => {
    const expense = await Expense.create(expenseData, { transaction: t });

    await ExpenseParticipant.bulkCreate(
      participants.map((p) => ({
        expense_id: expense.id,
        user_id: p.userId,
        share_amount: p.shareAmount,
      })),
      { transaction: t }
    );

    return expense.reload({ include: [{ association: "participants" }], transaction: t });
  });
}

export async function updateExpenseWithParticipants(expense, expenseData, participants, transaction = null) {
  return runInTransaction(transaction, async (t) => {
    await expense.update(expenseData, { transaction: t });
    await ExpenseParticipant.destroy({ where: { expense_id: expense.id }, transaction: t });
    await ExpenseParticipant.bulkCreate(
      participants.map((p) => ({
        expense_id: expense.id,
        user_id: p.userId,
        share_amount: p.shareAmount,
      })),
      { transaction: t }
    );

    return expense.reload({ include: [{ association: "participants" }], transaction: t });
  });
}

export async function deleteExpense(expense, transaction = null) {
  return runInTransaction(transaction, async (t) => {
    await expense.destroy({ transaction: t });
  });
}
