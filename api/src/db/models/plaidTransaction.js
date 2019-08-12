// { account_id: 'jz6Pv1yoGpsgqaV3AgkdURXMJwRMw9C15AVnX',
//   account_owner: null,
//   amount: -4.22,
//   category: [Array],
//   category_id: '21005000',
//   date: '2019-07-15',
//   iso_currency_code: 'USD',
//   location: [Object],
//   name: 'INTRST PYMNT',
//   payment_meta: [Object],
//   pending: false,
//   pending_transaction_id: null,
//   transaction_id: 'WnAz3ljraJh1L4re51qJHjLe458jKntlZ81me',
//   transaction_type: 'special',
//   unofficial_currency_code: null } ],
export default (sequelize, DataTypes) => {
  const PlaidTransaction = sequelize.define('PlaidTransaction', {
    transactionId: {
      type: DataTypes.TEXT,
      field: 'transaction_id',
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.TEXT,
      field: 'transaction_type',
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    categoryId: {
      type: DataTypes.TEXT,
      field: 'category_id',
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(13, 4),
      allowNull: false,
    },
    pending: {
      type: DataTypes.BOOLEAN,
    },
    pendingTransactionId: {
      type: DataTypes.TEXT,
      field: 'pending_transaction_id',
    },
    accountId: {
      type: DataTypes.TEXT,
      field: 'account_id',
    },
  });

  PlaidTransaction.associate = models => {
    const { PlaidTransaction, PlaidAccount } = models;

    PlaidTransaction.PendingTransaction = PlaidTransaction.belongsTo(PlaidTransaction, {
      foreignKey: 'pending_transaction_id',
      as: 'pendingTransaction',
    });

    PlaidTransaction.PlaidAccount = PlaidTransaction.belongsTo(PlaidAccount, {
      foreignKey: 'account_id',
      as: 'plaidAccount',
    });
  };

  return PlaidTransaction;
};
