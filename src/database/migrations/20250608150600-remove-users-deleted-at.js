"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeIndex("users", "idx_users_deleted_at");
    await queryInterface.removeColumn("users", "deleted_at");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "deleted_at", {
      allowNull: true,
      type: Sequelize.DATE(3),
    });
    await queryInterface.addIndex("users", ["deleted_at"], {
      name: "idx_users_deleted_at",
    });
  },
};
