module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NotificationSettings', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      module: {
        type: Sequelize.ENUM('Orders', 'Emails', 'Users'),
        allowNull: false,
      },
      notification_type: {
        type: Sequelize.ENUM('Info', 'Warning', 'Error'),
        allowNull: false,
      },
      channel: {
        type: Sequelize.ENUM('Email', 'SMS', 'In-App'),
        allowNull: false,
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      delivery_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('NotificationSettings');
  },
};
