export default (sequelize, DataTypes) => {
  const PlaidItem = sequelize.define(
    'PlaidItem',
    {
      itemId: {
        type: DataTypes.STRING,
        field: 'item_id',
        primaryKey: true,
      },
      accessToken: { type: DataTypes.STRING, field: 'access_token' },
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
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      loginRequired: {
        type: DataTypes.BOOLEAN,
        field: 'login_required',
        allowNull: false,
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_items',
    },
  );

  PlaidItem.associate = models => {
    const { PlaidAccount, PlaidInstitution, User } = models;

    PlaidItem.PlaidInstitution = PlaidItem.belongsTo(PlaidInstitution, {
      foreignKey: 'plaid_institution_id',
      as: 'plaidInstitution',
    });

    PlaidItem.User = PlaidItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    PlaidItem.PlaidAccounts = PlaidItem.hasMany(PlaidAccount, {
      foreignKey: 'plaid_item_id',
      as: 'accounts',
    });
  };

  return PlaidItem;
};
