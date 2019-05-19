import { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { google } from 'googleapis';
import AccountType from '../account';
import CalendarType from '../calendar';
import db from '../../db';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    accounts: {
      type: new GraphQLList(AccountType),
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (user, args) => {
        return db.PlaidAccount.findAll({
          where: { userId: user.id },
          offset: args.offset || undefined,
          limit: args.limit || undefined,
          order: [['createdAt', 'DESC'], ['accountId', 'ASC']],
        });
      },
    },
    calendars: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CalendarType))),
      resolve: async (_source, _args, { googleAuth }) => {
        const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });

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
        const response = await calendarAPI.calendarList.list();
        const calendarNames = (response.data.items || []).map(i => i.summary);
        return calendarNames.map(n => ({ name: n }));
      },
    },
  },
});
