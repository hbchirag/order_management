module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SFTPConfigurations', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      sftp_server_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      port: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 22,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      private_key_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      upload_orders_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      download_processed_orders_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      download_customers_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      upload_processed_customers_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      backup_directory_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      log_file_directory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      retry_interval: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      retry_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      is_active: {
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
    await queryInterface.dropTable('SFTPConfigurations');
  },
};
