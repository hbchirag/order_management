'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Emails', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bcc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attachments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      classification_log: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Fetched', 'Filtered Out', 'Pending Review', 'Confirmed Order Email'),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Emails');
  },
};
