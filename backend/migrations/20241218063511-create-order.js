'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // To allow for orders without associated customers initially
      },
      email_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // Optional association with Emails table
      },
      job_owner_id: {
        type: Sequelize.BIGINT,
        allowNull: true, // Optional association with Users table
      },
      tms_customer_id: {
        type: Sequelize.STRING(50),
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
      currency: {
        type: Sequelize.ENUM('USD', 'EUR', 'GBP'),
        allowNull: true,
      },
      total_jobs: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      xml_generated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      xml_backup_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_order_ref: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      tms_order_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
