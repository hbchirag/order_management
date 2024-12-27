'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderAttachment extends Model {
    static associate(models) {
      OrderAttachment.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      OrderAttachment.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator',
      });
      OrderAttachment.hasMany(models.ExtractedFieldData, {
        foreignKey: 'attachment_id',
        as: 'extractedFields',
      });
      OrderAttachment.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updater',
      });
    }
  }

  OrderAttachment.init(
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
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: DataTypes.ENUM('pdf', 'image'),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      modelName: 'OrderAttachment',
      tableName: 'OrderAttachments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return OrderAttachment;
};
