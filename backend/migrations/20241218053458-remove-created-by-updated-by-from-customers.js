'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Customers', 'created_by');
    await queryInterface.removeColumn('Customers', 'updated_by');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the columns back if the migration is rolled back
    await queryInterface.addColumn('Customers', 'created_by', {
      type: Sequelize.BIGINT,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: true,
    });
    await queryInterface.addColumn('Customers', 'updated_by', {
      type: Sequelize.BIGINT,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: true,
    });
  },
};
