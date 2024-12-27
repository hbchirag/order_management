'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderJob extends Model {
    static associate(models) {
      OrderJob.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      OrderJob.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator',
      });
      OrderJob.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updater',
      });
    }
  }

  OrderJob.init(
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
      sequence_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_description: {
        type: DataTypes.ENUM('Load', 'Unload'),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time_is_fixed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      specific_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      date_range_start: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      date_range_end: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'OrderJob',
      tableName: 'OrderJobs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return OrderJob;
};
