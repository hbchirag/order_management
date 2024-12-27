'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique constraint to `role_name` in `roles` table
    await queryInterface.addConstraint('roles', {
      fields: ['role_name'],
      type: 'unique',
      name: 'unique_role_name',
    });

    // Add unique constraint to `action` in `permissions` table
    await queryInterface.addConstraint('permissions', {
      fields: ['action'],
      type: 'unique',
      name: 'unique_permission_action',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints
    await queryInterface.removeConstraint('roles', 'unique_role_name');
    await queryInterface.removeConstraint('permissions', 'unique_permission_action');
  },
};
