import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { google } from 'googleapis';
import CalendarType from '../calendar';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    calendars: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CalendarType))),
      resolve: async (_source, _args, { googleAuth }) => {
        const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });
        const response = await calendarAPI.calendarList.list();
        const calendarNames = (response.data.items || []).map(i => i.summary);
        return calendarNames.map(n => ({ name: n }));
      },
    },
  },
});
