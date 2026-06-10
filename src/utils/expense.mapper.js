export function toExpenseResponse(expense) {
  return {
    id: expense.id,
    name: expense.name,
    totalAmount: expense.total_amount,
    currency: expense.currency,
    expenseDate: expense.expense_date,
    splitType: expense.split_type,
    createdByUserId: expense.created_by_user_id,
    paidByUserId: expense.paid_by_user_id,
    participants: (expense.participants || []).map((participant) => ({
      userId: participant.user_id,
      shareAmount: participant.share_amount,
      user: participant.user
        ? {
            id: participant.user.id,
            email: participant.user.email,
          }
        : undefined,
    })),
    creator: expense.creator
      ? { id: expense.creator.id, email: expense.creator.email }
      : undefined,
    payer: expense.payer
      ? { id: expense.payer.id, email: expense.payer.email }
      : undefined,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}
