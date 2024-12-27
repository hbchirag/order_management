'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PotentialCustomer extends Model {
    static associate(models) {
      // Define relationships here
      PotentialCustomer.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
    }
  }
  PotentialCustomer.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true, // Mark as primary key
        autoIncrement: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      zip_code: DataTypes.STRING,
      extraction_date: DataTypes.DATE,
      order_id: DataTypes.BIGINT,
      status: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Discarded'),
        defaultValue: 'Pending',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'PotentialCustomer',
      tableName: 'potentialcustomers', // Ensure table name matches migration
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return PotentialCustomer;
};
