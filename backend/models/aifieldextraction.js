'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AIFieldExtraction extends Model {
    static associate(models) {
      AIFieldExtraction.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
    }
  }
  AIFieldExtraction.init(
    {
      extraction_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      total_requested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_extracted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      extraction_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      confidence_average: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Completed', 'Pending', 'Error'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AIFieldExtraction',
      tableName: 'ai_field_extractions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return AIFieldExtraction;
};
