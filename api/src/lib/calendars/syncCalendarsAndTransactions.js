import { groupBy } from 'lodash';

export default transactions => {
  const transactionsByDate = groupBy(transactions, 'date');
  console.log('transactionsByDate', transactionsByDate);
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
