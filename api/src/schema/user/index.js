import { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import AccountType from '../account';
import CalendarType from '../calendar';
import { getUserAccounts, getUserCalendars } from './resolvers';

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
      resolve: getUserAccounts,
    },
    calendars: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CalendarType))),
      resolve: getUserCalendars,
    },
  },
});
