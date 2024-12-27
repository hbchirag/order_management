'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Field_Change_Logs', {
      log_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      field_data_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Extracted_Field_Data', // Correct table reference
          key: 'field_data_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      field_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      previous_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      new_value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      update_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Field_Change_Logs');
  },
};
