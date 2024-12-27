'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_users_role_id', // Custom constraint name
      references: {
        table: 'Roles',
        field: 'role_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'fk_users_role_id');
  },
};
