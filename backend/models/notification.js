module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      module: {
        type: DataTypes.ENUM('Orders', 'Emails', 'Users'),
        allowNull: false,
      },
      entity_type: {
        type: DataTypes.ENUM('Order', 'Email', 'User'),
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notification_type: {
        type: DataTypes.ENUM('Info', 'Warning', 'Error'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Unread', 'Read'),
        allowNull: false,
        defaultValue: 'Unread',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'Notifications',
      timestamps: true,
      createdAt: 'created_at',
    }
  );

  return Notification;
};
