import Sequelize, { Model } from "sequelize";

class ExpenseParticipant extends Model {
  static init(sequelize) {
    super.init(
      {
        expense_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        share_amount: {
          type: Sequelize.DECIMAL(19, 4),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: 0,
          },
        },
      },
      {
        sequelize,
        tableName: "expense_participants",
        underscored: true,
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ["expense_id", "user_id"],
            name: "idx_expense_participants_unique",
          },
        ],
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Expense, {
      foreignKey: "expense_id",
      as: "expense",
    });

    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

export default ExpenseParticipant;
