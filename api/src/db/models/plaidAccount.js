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
    const { PlaidAccountsCalendars, PlaidInstitution, PlaidItem, Calendar, User } = models;

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

    PlaidAccount.Calendars = PlaidAccount.belongsToMany(Calendar, {
      through: PlaidAccountsCalendars,
      foreignKey: 'calendar_id',
      as: 'Calendars',
    });
  };

  return PlaidAccount;
};
