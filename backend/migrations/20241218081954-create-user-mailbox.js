'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserMailboxes', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      tm_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users', // Name of the table being referenced
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sync_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sync_status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      synchronization_frequency: {
        type: Sequelize.ENUM('Every 15 minutes', 'Every hour', 'Daily', 'Manually'),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserMailboxes');
  },
};
