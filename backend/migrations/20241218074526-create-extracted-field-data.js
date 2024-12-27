'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Extracted_Field_Data', {
      field_data_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Orders', // Correct model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      confidence: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      source: {
        type: Sequelize.ENUM('Subject', 'Body', 'Attachment'),
        allowNull: false,
      },
      field_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attachment_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'OrderAttachments', // Correct table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      validation_status: {
        type: Sequelize.ENUM('Validated', 'Unverified', 'Manual Review'),
        allowNull: false,
      },
      reviewer_comments: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      extraction_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Extracted_Field_Data');
  },
};
