'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role has many Users
      Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });

      // Role has many Permissions
      Role.hasMany(models.Permission, { foreignKey: 'role_id', as: 'permissions' });

      // Role references User for created_by and updated_by
      Role.belongsTo(models.User, { foreignKey: 'created_by', as: 'createdBy' });
      Role.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updatedBy' });
    }
  }

  Role.init(
    {
      role_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
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
      modelName: 'Role',
      tableName: 'roles',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Role;
};
