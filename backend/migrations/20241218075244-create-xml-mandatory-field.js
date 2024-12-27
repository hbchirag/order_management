'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('XML_Mandatory_Fields', {
      field_id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      field_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      field_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      xml_tag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('XML_Mandatory_Fields');
  },
};
