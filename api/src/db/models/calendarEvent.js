export default (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define(
    'CalendarEvent',
    {
      eventId: { type: DataTypes.STRING, field: 'event_id' },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      colorId: {
        type: DataTypes.TEXT,
        field: 'color_id',
      },
      googleCalendarId: {
        type: DataTypes.TEXT,
        field: 'google_calendar_id',
        allowNull: false,
      },
      calendarId: {
        type: DataTypes.INTEGER,
        field: 'calendar_id',
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(['income', 'expenses']),
      },
    },
    {
      schema: 'app',
      tableName: 'calendar_events',
    },
  );

  CalendarEvent.associate = models => {
    const { Calendar } = models;

    CalendarEvent.Calendar = CalendarEvent.belongsTo(Calendar, {
      foreignKey: 'calendar_id',
      as: 'calendar',
    });
  };

  return CalendarEvent;
};
