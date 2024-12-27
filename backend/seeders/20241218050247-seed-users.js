'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      { first_name: 'John', last_name: 'Doe', email: 'admin@example.com', password: 'hashedpassword', role_id: 1, status: 'Active', created_at: new Date(), updated_at: new Date() },
      { first_name: 'Jane', last_name: 'Smith', email: 'manager@example.com', password: 'hashedpassword', role_id: 2, status: 'Active', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
