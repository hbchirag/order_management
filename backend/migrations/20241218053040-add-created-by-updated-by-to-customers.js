'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Customers', 'created_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'Users', // Name of the referenced table
        key: 'id',      // Key in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Customers', 'updated_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'Users', // Name of the referenced table
        key: 'id',      // Key in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers', 'created_by');
    await queryInterface.removeColumn('Customers', 'updated_by');
  },
};
