'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GlobalIMAPConfigurations', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      authentication_type: {
        type: Sequelize.ENUM('OAuth2', 'Username/Password'),
        allowNull: false,
      },
      imap_server_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imap_server_port: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.STRING,
      },
      client_secret: {
        type: Sequelize.TEXT,
      },
      tenant_id: {
        type: Sequelize.STRING,
      },
      authorization_url: {
        type: Sequelize.STRING,
      },
      token_url: {
        type: Sequelize.STRING,
      },
      scopes: {
        type: Sequelize.TEXT,
      },
      admin_username: {
        type: Sequelize.STRING,
      },
      admin_password: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GlobalIMAPConfigurations');
  },
};
