'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.hasMany(models.OrderJob, { foreignKey: 'order_id', as: 'jobs' });
      this.hasMany(models.OrderAttachment, { foreignKey: 'order_id', as: 'attachments' });
      this.hasMany(models.OrderStatusLog, { foreignKey: 'order_id', as: 'statusLogs' });
      this.hasMany(models.ExtractedFieldData, { foreignKey: 'order_id', as: 'extractedFields' });
      this.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      this.belongsTo(models.Email, { foreignKey: 'email_id', as: 'email' });
      this.belongsTo(models.User, { foreignKey: 'job_owner_id', as: 'owner' });
    }

  }
  Order.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      customer_id: DataTypes.BIGINT,
      email_id: DataTypes.BIGINT,
      job_owner_id: DataTypes.BIGINT,
      tms_customer_id: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM(
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
      currency: DataTypes.ENUM('USD', 'EUR', 'GBP'),
      total_jobs: DataTypes.INTEGER,
      xml_generated: DataTypes.BOOLEAN,
      xml_backup_path: DataTypes.STRING,
      customer_order_ref: DataTypes.STRING,
      tms_order_id: DataTypes.STRING,
      created_by: DataTypes.BIGINT,
      updated_by: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Order;
};
