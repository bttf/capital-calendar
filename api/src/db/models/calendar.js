export default (sequelize, DataTypes) => {
  const Calendar = sequelize.define(
    'Calendar',
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
      googleCalendarId: {
        type: DataTypes.STRING,
        field: 'google_calendar_id',
        allowNull: false,
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
      tableName: 'calendars',
    },
  );

  Calendar.associate = models => {
    const { PlaidAccountsCalendars, PlaidAccount, User } = models;

    Calendar.User = Calendar.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Calendar.PlaidAccounts = Calendar.belongsToMany(PlaidAccount, {
      as: 'plaidAccounts',
      through: PlaidAccountsCalendars,
      foreignKey: 'account_id',
    });
  };

  return Calendar;
};
