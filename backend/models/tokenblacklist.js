'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenBlacklist extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  TokenBlacklist.init(
    {
      token: {
        type: DataTypes.STRING(512), // Match the length set in the migration
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'TokenBlacklist',
      tableName: 'TokenBlacklists',
      timestamps: true,
    }
  );
  return TokenBlacklist;
};
