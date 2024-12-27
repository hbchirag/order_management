'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { role_name: 'Admin', description: 'System Admin', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_name: 'Transport Manager', description: 'Manages transportation', status: 'Active', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
