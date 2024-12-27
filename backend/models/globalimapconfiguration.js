'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GlobalIMAPConfiguration extends Model {
    static associate(models) {
      // Define associations if any
    }
  }
  GlobalIMAPConfiguration.init(
    {
      authentication_type: {
        type: DataTypes.ENUM('OAuth2', 'Username/Password'),
        allowNull: false,
      },
      imap_server_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imap_server_port: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      client_id: DataTypes.STRING,
      client_secret: DataTypes.TEXT,
      tenant_id: DataTypes.STRING,
      authorization_url: DataTypes.STRING,
      token_url: DataTypes.STRING,
      scopes: DataTypes.TEXT,
      admin_username: DataTypes.STRING,
      admin_password: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'GlobalIMAPConfiguration',
      tableName: 'GlobalIMAPConfigurations',
      underscored: true,
    }
  );
  return GlobalIMAPConfiguration;
};
