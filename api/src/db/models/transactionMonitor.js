export default (sequelize, DataTypes) => {
  const TransactionMonitor = sequelize.define(
    'TransactionMonitor',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cadence: {
        type: DataTypes.ENUM(['daily', 'weekly', 'monthly']),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      schema: 'app',
      tableName: 'transaction_monitors',
    },
  );

  TransactionMonitor.associate = models => {
    const { PlaidAccountsTransactionMonitors, PlaidAccount, User } = models;

    TransactionMonitor.User = TransactionMonitor.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    TransactionMonitor.PlaidAccounts = TransactionMonitor.belongsToMany(PlaidAccount, {
      as: 'plaidAccounts',
      through: PlaidAccountsTransactionMonitors,
      foreignKey: 'account_id',
    });
  };

  return TransactionMonitor;
};
