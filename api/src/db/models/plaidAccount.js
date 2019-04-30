export default (sequelize, DataTypes) => {
  const PlaidAccount = sequelize.define(
    'PlaidAccount',
    {
      accountId: {
        type: DataTypes.STRING,
        field: 'account_id',
        primaryKey: true,
      },
      name: { type: DataTypes.STRING },
      officialName: {
        type: DataTypes.STRING,
        field: 'official_name',
      },
      mask: { type: DataTypes.STRING },
      subtype: { type: DataTypes.STRING },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      plaidItemId: {
        type: DataTypes.STRING,
        field: 'plaid_item_id',
      },
      plaidInstitutionId: {
        type: DataTypes.STRING,
        field: 'plaid_institution_id',
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
      tableName: 'plaid_accounts',
    },
  );

  PlaidAccount.associate = models => {
    const {
      PlaidAccountsTransactionMonitors,
      PlaidInstitution,
      PlaidItem,
      TransactionMonitor,
      User,
    } = models;

    PlaidAccount.PlaidInstitution = PlaidAccount.belongsTo(PlaidInstitution, {
      foreignKey: 'plaid_institution_id',
      as: 'plaidInstitution',
    });

    PlaidAccount.PlaidItem = PlaidAccount.belongsTo(PlaidItem, {
      foreignKey: 'plaid_item_id',
      as: 'plaidItem',
    });

    PlaidAccount.User = PlaidAccount.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    PlaidAccount.TransactionMonitors = PlaidAccount.belongsToMany(TransactionMonitor, {
      through: PlaidAccountsTransactionMonitors,
      foreignKey: 'transaction_monitor_id',
      as: 'TransactionMonitors',
    });
  };

  return PlaidAccount;
};
