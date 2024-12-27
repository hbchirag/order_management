'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_users_created_by', // Custom constraint name
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Users', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_users_updated_by', // Custom constraint name
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'fk_users_created_by');
    await queryInterface.removeConstraint('Users', 'fk_users_updated_by');
  },
};
