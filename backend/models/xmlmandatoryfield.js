'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class XMLMandatoryField extends Model {
    static associate(models) {
      // No direct relationships for this table
    }
  }

  XMLMandatoryField.init(
    {
      field_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      field_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      xml_tag: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: 'XMLMandatoryField',
      tableName: 'XML_Mandatory_Fields',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return XMLMandatoryField;
};
