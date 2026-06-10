import Sequelize, { Model } from "sequelize";
import { SPLIT_TYPE_VALUES } from "../constants/split-types";

class Expense extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        total_amount: {
          type: Sequelize.DECIMAL(19, 4),
          allowNull: false,
          validate: {
            isDecimal: true,
            min: 0.0001,
          },
        },
        currency: {
          type: Sequelize.CHAR(3),
          allowNull: false,
        },
        expense_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        split_type: {
          type: Sequelize.ENUM(...SPLIT_TYPE_VALUES),
          allowNull: false,
          defaultValue: "equal",
        },
        created_by_user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        paid_by_user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "expenses",
        underscored: true,
        timestamps: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "created_by_user_id",
      as: "creator",
    });

    this.belongsTo(models.User, {
      foreignKey: "paid_by_user_id",
      as: "payer",
    });

    this.hasMany(models.ExpenseParticipant, {
      foreignKey: "expense_id",
      as: "participants",
      onDelete: "CASCADE",
    });
  }
}

export default Expense;
