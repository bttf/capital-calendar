export default (sequelize, DataTypes) => {
  const PlaidAccountsCalendars = sequelize.define(
    'PlaidAccountsCalendars',
    {
      accountId: {
        type: DataTypes.STRING,
        field: 'account_id',
      },
      calendarId: {
        type: DataTypes.INTEGER,
        field: 'calendar_id',
      },
      type: {
        type: DataTypes.ENUM(['income', 'expenses']),
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_accounts_calendars',
    },
  );

  PlaidAccountsCalendars.associate = models => {
    const { PlaidAccount, Calendar } = models;

    PlaidAccountsCalendars.PlaidAccount = PlaidAccountsCalendars.belongsTo(PlaidAccount, {
      foreignKey: 'account_id',
      as: 'plaidAccount',
    });

    PlaidAccountsCalendars.Calendar = PlaidAccountsCalendars.belongsTo(Calendar, {
      foreignKey: 'calendar_id',
      as: 'calendar',
    });
  };

  return PlaidAccountsCalendars;
};
