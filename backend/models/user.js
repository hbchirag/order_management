'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Self-referential associations
      User.belongsTo(models.User, { foreignKey: 'created_by', as: 'createdBy' });
      User.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updatedBy' });

      // Users created and updated by this user
      User.hasMany(models.User, { foreignKey: 'created_by', as: 'usersCreated' });
      User.hasMany(models.User, { foreignKey: 'updated_by', as: 'usersUpdated' });

      // User belongs to Role
      User.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });

      // User creates and updates Roles and Permissions
      User.hasMany(models.Role, { foreignKey: 'created_by', as: 'createdRoles' });
      User.hasMany(models.Role, { foreignKey: 'updated_by', as: 'updatedRoles' });
      User.hasMany(models.Permission, { foreignKey: 'created_by', as: 'createdPermissions' });
      User.hasMany(models.Permission, { foreignKey: 'updated_by', as: 'updatedPermissions' });
    }
  }
  User.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    role_id: DataTypes.BIGINT,
    status: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    department: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    created_by: DataTypes.BIGINT, // Add this
    updated_by: DataTypes.BIGINT, // Add this
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return User;
};
