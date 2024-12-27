'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminRoleId = 1; // Admin Role ID

    const permissions = [
      // Role Management
      { role_id: adminRoleId, action: 'create_role', description: 'Create roles', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'view_roles', description: 'View all roles', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'update_role', description: 'Update roles', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'delete_role', description: 'Delete roles', status: 'Active', created_at: new Date(), updated_at: new Date() },

      // Permission Management
      { role_id: adminRoleId, action: 'create_permission', description: 'Create permissions', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'view_permissions', description: 'View all permissions', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'update_permission', description: 'Update permissions', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: adminRoleId, action: 'delete_permission', description: 'Delete permissions', status: 'Active', created_at: new Date(), updated_at: new Date() },
    ];

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', { role_id: 1 }, {});
  },
};
