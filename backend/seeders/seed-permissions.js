module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Permissions', [
      { role_id: 1, action: 'view_users', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: 1, action: 'view_user', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: 1, action: 'create_user', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: 1, action: 'update_user', status: 'Active', created_at: new Date(), updated_at: new Date() },
      { role_id: 1, action: 'delete_user', status: 'Active', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Permissions', { role_id: 1 }, {});
  },
};
