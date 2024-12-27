module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      module: {
        type: Sequelize.ENUM('Orders', 'Emails', 'Users'),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.ENUM('Order', 'Email', 'User'),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notification_type: {
        type: Sequelize.ENUM('Info', 'Warning', 'Error'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Unread', 'Read'),
        allowNull: false,
        defaultValue: 'Unread',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      read_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Notifications');
  },
};
