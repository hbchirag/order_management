'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Permissions', [
      { role_id: 1, action: 'create', description: 'Create entities', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: 2, action: 'read', description: 'Read entities', status: 'Active', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  },
};
