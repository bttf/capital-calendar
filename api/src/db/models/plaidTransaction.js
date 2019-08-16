export default (sequelize, DataTypes) => {
  const PlaidTransaction = sequelize.define(
    'PlaidTransaction',
    {
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
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_transactions',
      paranoid: true,
      timestamps: true,
    },
  );

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
