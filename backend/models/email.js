'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    static associate(models) {
      // Define association to EmailAttachment
      Email.hasMany(models.EmailAttachment, {
        foreignKey: 'email_id',
        as: 'attachments',
        onDelete: 'CASCADE',
      });

      // Optionally, define association to ActivityLog
      Email.hasMany(models.ActivityLog, {
        foreignKey: 'email_id',
        as: 'activity_logs',
        onDelete: 'CASCADE',
      });
    }
  }

  Email.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      received_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      classification_log: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Fetched', 'Filtered Out', 'Pending Review', 'Confirmed Order Email', 'Order Email'),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Email',
      tableName: 'Emails',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Email;
};
