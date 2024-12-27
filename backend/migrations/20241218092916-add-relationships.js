'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Order Jobs -> Orders
    await queryInterface.addConstraint('orderjobs', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_order_jobs_order_id',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Order Attachments -> Orders
    await queryInterface.addConstraint('orderattachments', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_order_attachments_order_id',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Order Status Logs -> Orders
    await queryInterface.addConstraint('orderstatuslogs', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_order_status_logs_order_id',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Extracted Field Data -> Orders
    await queryInterface.addConstraint('extracted_field_data', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_extracted_field_data_order_id',
      references: {
        table: 'orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Field Change Logs -> Extracted Field Data
    await queryInterface.addConstraint('field_change_logs', {
      fields: ['field_data_id'],
      type: 'foreign key',
      name: 'fk_field_change_logs_field_data_id',
      references: {
        table: 'extracted_field_data',
        field: 'field_data_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraints (reverse order)
    await queryInterface.removeConstraint('users', 'fk_users_role_id');
    await queryInterface.removeConstraint('permissions', 'fk_permissions_role_id');
    await queryInterface.removeConstraint('permissions', 'fk_permissions_created_by');
    await queryInterface.removeConstraint('permissions', 'fk_permissions_updated_by');
    await queryInterface.removeConstraint('orders', 'fk_orders_job_owner_id');
    await queryInterface.removeConstraint('orders', 'fk_orders_customer_id');
    await queryInterface.removeConstraint('orders', 'fk_orders_email_id');
    await queryInterface.removeConstraint('orderjobs', 'fk_order_jobs_order_id');
    await queryInterface.removeConstraint('orderattachments', 'fk_order_attachments_order_id');
    await queryInterface.removeConstraint('orderstatuslogs', 'fk_order_status_logs_order_id');
    await queryInterface.removeConstraint('extracted_field_data', 'fk_extracted_field_data_order_id');
    await queryInterface.removeConstraint('field_change_logs', 'fk_field_change_logs_field_data_id');
  },
};
