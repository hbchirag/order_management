module.exports = (sequelize, DataTypes) => {
  const CustomerEmail = sequelize.define(
    'CustomerEmail',
    {
      customer_email_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'CustomerEmails',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Define relationships
  CustomerEmail.associate = (models) => {
    CustomerEmail.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return CustomerEmail;
};
