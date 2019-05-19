import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLEnumType } from 'graphql';

export const TransactionMonitorCadenceEnumType = new GraphQLEnumType({
  name: 'TransactionMonitorCadenceEnum',
  values: {
    DAILY: { value: 'daily' },
    WEEKLY: { value: 'weekly' },
    MONTHLY: { value: 'monthly' },
  },
});

export default new GraphQLObjectType({
  name: 'TransactionMonitor',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    cadence: {
      type: new GraphQLNonNull(TransactionMonitorCadenceEnumType),
    },
  },
});
