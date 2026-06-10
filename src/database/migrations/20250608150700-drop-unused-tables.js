"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS activity_logs");
    await queryInterface.sequelize.query("DROP TABLE IF EXISTS exchange_rates");
  },

  down: async () => {
  },
};
