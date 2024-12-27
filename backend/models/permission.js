'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // Permission belongs to Role
      Permission.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });

      // Permission references User for created_by and updated_by
      Permission.belongsTo(models.User, { foreignKey: 'created_by', as: 'createdBy' });
      Permission.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updatedBy' });
    }
  }

  Permission.init(
    {
      permission_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active',
      },
      created_by: DataTypes.BIGINT,
      updated_by: DataTypes.BIGINT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Permission;
};
