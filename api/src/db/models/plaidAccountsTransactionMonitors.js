export default (sequelize, DataTypes) => {
  const PlaidAccountsTransactionMonitors = sequelize.define(
    'PlaidAccountsTransactionMonitors',
    {
      accountId: {
        type: DataTypes.STRING,
        field: 'account_id',
        allowNull: false,
      },
      transactionMonitorId: {
        type: DataTypes.STRING,
        field: 'transaction_monitor_id',
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(['income', 'expenses']),
        allowNull: false,
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_accounts_transaction_monitors',
    },
  );

  PlaidAccountsTransactionMonitors.associate = models => {
    const { PlaidAccount, TransactionMonitor } = models;

    PlaidAccountsTransactionMonitors.PlaidAccount = PlaidAccountsTransactionMonitors.belongsTo(
      PlaidAccount,
      {
        foreignKey: 'account_id',
        as: 'plaidAccount',
      },
    );

    PlaidAccountsTransactionMonitors.TransactionMonitor = PlaidAccountsTransactionMonitors.belongsTo(
      TransactionMonitor,
      {
        foreignKey: 'transaction_monitor_id',
        as: 'transactionMonitor',
      },
    );
  };

  return PlaidAccountsTransactionMonitors;
};
