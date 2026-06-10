"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("expenses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      total_amount: {
        allowNull: false,
        type: Sequelize.DECIMAL(19, 4),
      },
      currency: {
        allowNull: false,
        type: Sequelize.CHAR(3),
      },
      expense_date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      split_type: {
        allowNull: false,
        type: Sequelize.ENUM("equal", "exact", "percentage"),
        defaultValue: "equal",
      },
      created_by_user_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      paid_by_user_id: {
        allowNull: false,
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"
        ),
      },
    });

    await queryInterface.addIndex("expenses", ["created_by_user_id"], {
      name: "idx_expenses_created_by",
    });

    await queryInterface.addIndex("expenses", ["paid_by_user_id"], {
      name: "idx_expenses_paid_by",
    });

    await queryInterface.addIndex("expenses", ["expense_date"], {
      name: "idx_expenses_date",
    });

    await queryInterface.addIndex("expenses", ["currency"], {
      name: "idx_expenses_currency",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("expenses");
  },
};
