'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Permissions', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_permissions_role_id', // Custom constraint name
      references: {
        table: 'Roles',
        field: 'role_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Permissions', 'fk_permissions_role_id');
  },
};
