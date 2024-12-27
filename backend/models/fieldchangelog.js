'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FieldChangeLog extends Model {
    static associate(models) {
      FieldChangeLog.belongsTo(models.ExtractedFieldData, {
        foreignKey: 'field_data_id',
        as: 'extractedField',
      });
    }
  }

  FieldChangeLog.init(
    {
      log_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      field_data_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      field_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previous_value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      new_value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      update_timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'FieldChangeLog',
      tableName: 'Field_Change_Logs',
      timestamps: true,
      createdAt: 'update_timestamp',
    }
  );

  return FieldChangeLog;
};
