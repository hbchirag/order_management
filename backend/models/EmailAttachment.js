'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailAttachment extends Model {
    static associate(models) {
      EmailAttachment.belongsTo(models.Email, {
        foreignKey: 'email_id',
        as: 'email',
        onDelete: 'CASCADE',
      });
    }
  }

  EmailAttachment.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      email_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING,
      },
      file_size: {
        type: DataTypes.BIGINT,
      },
      file_path: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize, // Make sure the Sequelize instance is passed here
      modelName: 'EmailAttachment',
      tableName: 'EmailAttachments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return EmailAttachment;
};
