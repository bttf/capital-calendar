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

  // eslint-disable-next-line no-console
  console.log('DEBUG Calendars', calendars);

  return calendars.map(c => {
    const googleCalendar = googleCalendars[c.googleCalendarId] || {};
    return {
      ...c.toJSON(),
      backgroundColor: googleCalendar.backgroundColor,
      googleCalendarInSync: !!googleCalendar.id,
    };
  });
};

// GOOGLE API STUFF
//
// const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });

// Creating a calendar
// const response = await calendarAPI.calendars.insert({
//   requestBody: {
//     summary: 'capital calendar lives',
//     timeZone: 'America/Los_Angeles'
//   }
// });

// capital calendar lives calendar id
// nj5q715ms415urme8ilai1kbdk@group.calendar.google.com

// Creating event
// const response = await calendarAPI.events.insert({
//   calendarId: 'nj5q715ms415urme8ilai1kbdk@group.calendar.google.com',
//   requestBody: {
//     summary: 'farfunuggen',
//     end: { date: '2019-05-19' },
//     start: { date: '2019-05-19' },
//   },
// })

// Fetching calendars
// const response = await calendarAPI.calendarList.list();
// const calendarNames = (response.data.items || []).map(i => i.summary);
// return calendarNames.map(n => ({ name: n }));
