import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: Sequelize.VIRTUAL,
          allowNull: true,
        },
        password_hash: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        default_currency: {
          type: Sequelize.CHAR(3),
          allowNull: false,
          defaultValue: "USD",
        },
      },
      {
        sequelize,
        tableName: "users",
        underscored: true,
        timestamps: true,
      }
    );

    this.addHook("beforeValidate", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Expense, {
      foreignKey: "created_by_user_id",
      as: "createdExpenses",
    });

    this.hasMany(models.Expense, {
      foreignKey: "paid_by_user_id",
      as: "paidExpenses",
    });

    this.hasMany(models.ExpenseParticipant, {
      foreignKey: "user_id",
      as: "expenseParticipations",
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
