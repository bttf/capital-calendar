import { google } from 'googleapis';

export default async ({ name, googleAuth }) => {
  const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });

  const response = await calendarAPI.calendars.insert({
    requestBody: { summary: name },
  });

  return response.data;
};
