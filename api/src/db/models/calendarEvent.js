export default (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define(
    'CalendarEvent',
    {
      event_id: { type: DataTypes.STRING, field: 'entity_id' },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      colorId: {
        type: DataTypes.TEXT,
      },
      googleCalendarId: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      calendarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
