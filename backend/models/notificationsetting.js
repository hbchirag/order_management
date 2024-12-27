module.exports = (sequelize, DataTypes) => {
  const NotificationSetting = sequelize.define(
    'NotificationSetting',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      module: {
        type: DataTypes.ENUM('Orders', 'Emails', 'Users'),
        allowNull: false,
      },
      notification_type: {
        type: DataTypes.ENUM('Info', 'Warning', 'Error'),
        allowNull: false,
      },
      channel: {
        type: DataTypes.ENUM('Email', 'SMS', 'In-App'),
        allowNull: false,
      },
      is_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      delivery_time: {
        type: DataTypes.TIME,
        allowNull: true,
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
      tableName: 'NotificationSettings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Define relationships
  NotificationSetting.associate = (models) => {
    NotificationSetting.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return NotificationSetting;
};
