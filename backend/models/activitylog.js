'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      ActivityLog.belongsTo(models.Email, { foreignKey: 'email_id', as: 'email' });
      ActivityLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  ActivityLog.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Fetched', 'Filtered Out', 'Pending Review', 'Confirmed Order Email', 'Order Email'),
        allowNull: false,
      },
      previous_status: {
        type: DataTypes.ENUM('Fetched', 'Filtered Out', 'Pending Review', 'Confirmed Order Email', 'Order Email'),
        allowNull: true,
      },
      action: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      action_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ActivityLog',
      tableName: 'ActivityLogs',
      timestamps: true,
      updatedAt: 'action_date',
      underscored: true,
    }
  );

  return ActivityLog;
};
