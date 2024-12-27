'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderStatusLogs', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      previous_status: {
        type: Sequelize.ENUM(
          'Unprocessed',
          'Missing Info',
          'Ready for Review',
          'Verified',
          'Cancelled',
          'Completed',
          'Error Received'
        ),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          'Unprocessed',
          'Missing Info',
          'Ready for Review',
          'Verified',
          'Cancelled',
          'Completed',
          'Error Received'
        ),
        allowNull: false,
      },
      status_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      changed_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderStatusLogs');
  },
};
