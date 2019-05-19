import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLEnumType } from 'graphql';

export const CalendarCadenceEnumType = new GraphQLEnumType({
  name: 'CalendarCadenceEnum',
  values: {
    DAILY: { value: 'daily' },
    WEEKLY: { value: 'weekly' },
    MONTHLY: { value: 'monthly' },
  },
});

export default new GraphQLObjectType({
  name: 'Calendar',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    cadence: {
      type: new GraphQLNonNull(CalendarCadenceEnumType),
    },
  },
});
