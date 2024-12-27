'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ai_field_extractions', {
      extraction_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_requested: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_extracted: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      extraction_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      confidence_average: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Completed', 'Pending', 'Error'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ai_field_extractions');
  },
};
