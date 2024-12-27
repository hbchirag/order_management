module.exports = (sequelize, DataTypes) => {
  const SFTPConfiguration = sequelize.define(
    'SFTPConfiguration',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      sftp_server_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 22,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      private_key_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upload_orders_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      download_processed_orders_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      download_customers_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upload_processed_customers_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      backup_directory_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      log_file_directory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      retry_interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      retry_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: 'SFTPConfigurations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return SFTPConfiguration;
};
