'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderStatusLog extends Model {
    static associate(models) {
      OrderStatusLog.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      OrderStatusLog.belongsTo(models.User, {
        foreignKey: 'changed_by',
        as: 'changer',
      });
    }
  }

  OrderStatusLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      previous_status: {
        type: DataTypes.ENUM(
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
      status_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      changed_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'OrderStatusLog',
      tableName: 'OrderStatusLogs',
      timestamps: false, // Disable Sequelize's default `timestamps` behavior
      createdAt: 'created_at', // Map `created_at` explicitly
    }
  );

  return OrderStatusLog;
};
