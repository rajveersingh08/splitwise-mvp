import { QueryTypes } from "sequelize";
import sequelizeService from "../services/sequelize.service";

const balanceRepository = {
  async getObligationsForUser(userId, currency = null) {
    const sequelize = sequelizeService.getInstance();

    const replacements = { userId };

    let currencyClause = "";

    if (currency) {
      currencyClause = "AND e.currency = :currency";
      replacements.currency = currency;
    }

    const rows = await sequelize.query(
      `
        SELECT
          ep.user_id AS debtor_id,
          e.paid_by_user_id AS creditor_id,
          e.currency AS currency,
          ep.share_amount AS share_amount
        FROM expense_participants ep
        INNER JOIN expenses e ON e.id = ep.expense_id
        WHERE ep.user_id <> e.paid_by_user_id
          AND (ep.user_id = :userId OR e.paid_by_user_id = :userId)
          ${currencyClause}
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return rows.map((row) => ({
      debtorId: Number(row.debtor_id),
      creditorId: Number(row.creditor_id),
      currency: row.currency,
      shareAmount: row.share_amount,
    }));
  },
};

export default balanceRepository;
