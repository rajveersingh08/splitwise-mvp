"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      default_currency: {
        allowNull: false,
        type: Sequelize.CHAR(3),
        defaultValue: "USD",
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE(3),
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

    await queryInterface.addIndex("users", ["email"], {
      name: "idx_users_email",
      unique: true,
    });

    await queryInterface.addIndex("users", ["deleted_at"], {
      name: "idx_users_deleted_at",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("users");
  },
};
