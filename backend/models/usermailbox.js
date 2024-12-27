'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserMailbox extends Model {
    static associate(models) {
      // Define association with Users table
      UserMailbox.belongsTo(models.User, {
        foreignKey: 'tm_id',
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  UserMailbox.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      tm_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sync_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      last_synced_at: {
        type: DataTypes.DATE,
        allowNull: true, // Allow null for initial setup
      },
      sync_status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
      synchronization_frequency: {
        type: DataTypes.ENUM('Every 15 minutes', 'Every hour', 'Daily', 'Manually'),
        allowNull: true,
      },
      imap_host: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imap_port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 993,
      },
      imap_encryption: {
        type: DataTypes.ENUM('SSL', 'TLS', 'None'),
        allowNull: false,
        defaultValue: 'SSL',
      },
      password: {
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
      modelName: 'UserMailbox',
      tableName: 'UserMailboxes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );
  return UserMailbox;
};
