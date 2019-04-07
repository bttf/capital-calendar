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
      plaidItemId: {
        type: DataTypes.STRING,
        field: 'plaid_item_id',
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
    const { PlaidItem } = models;
    PlaidAccount.PlaidItem = PlaidAccount.belongsTo(PlaidItem, {
      foreignKey: 'plaid_item_id',
      as: 'plaidItem',
    });
  };

  return PlaidAccount;
};
