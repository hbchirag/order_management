'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExtractedFieldData extends Model {
    static associate(models) {
      ExtractedFieldData.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
      ExtractedFieldData.belongsTo(models.OrderAttachment, {
        foreignKey: 'attachment_id',
        as: 'attachment',
      });
    }
  }

  ExtractedFieldData.init(
    {
      field_data_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      confidence: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      source: {
        type: DataTypes.ENUM('Subject', 'Body', 'Attachment'),
        allowNull: false,
      },
      field_value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attachment_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      validation_status: {
        type: DataTypes.ENUM('Validated', 'Unverified', 'Manual Review'),
        allowNull: false,
      },
      reviewer_comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      extraction_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ExtractedFieldData',
      tableName: 'Extracted_Field_Data',
      timestamps: true,
      createdAt: 'extraction_timestamp',
    }
  );

  return ExtractedFieldData;
};
