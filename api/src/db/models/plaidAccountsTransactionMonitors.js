export default (sequelize, DataTypes) => {
  const PlaidAccountsTransactionMonitors = sequelize.define(
    'PlaidAccountsTransactionMonitors',
    {
      accountId: {
        type: DataTypes.STRING,
        field: 'account_id',
      },
      transactionMonitorId: {
        type: DataTypes.INTEGER,
        field: 'transaction_monitor_id',
      },
      type: {
        type: DataTypes.ENUM(['income', 'expenses']),
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
