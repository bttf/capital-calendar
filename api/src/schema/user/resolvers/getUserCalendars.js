import { google } from 'googleapis';
import { keyBy } from 'lodash';
import db from '../../../db';

export default async (user, _args, { googleAuth }) => {
  const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });

  const response = (await calendarAPI.calendarList.list()) || {};
  const data = (response && response.data) || {};
  const items = data.items || [];
  const googleCalendars = keyBy(items, c => c.id);

  const calendars = await db.Calendar.findAll({
    where: { userId: user.id },
  });

  return calendars.map(c => {
    const googleCalendar = googleCalendars[c.googleCalendarId] || {};
    return {
      ...c.toJSON(),
      backgroundColor: googleCalendar.backgroundColor,
      googleCalendarInSync: !!googleCalendar.id,
    };
  });
};
