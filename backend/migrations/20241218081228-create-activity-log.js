'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ActivityLogs', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Emails', // Ensure this table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Fetched', 'Confirmed', 'Filtered Out', 'Error'),
        allowNull: false,
      },
      previous_status: {
        type: Sequelize.ENUM('Fetched', 'Confirmed', 'Filtered Out', 'Error'),
        allowNull: true,
      },
      action: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      action_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Users', // Ensure this table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      comments: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('ActivityLogs');
  },
};
