module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmailListEntries', {
      entry_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.ENUM('whitelist', 'blocklist'),
        allowNull: false,
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable('EmailListEntries');
  },
};
