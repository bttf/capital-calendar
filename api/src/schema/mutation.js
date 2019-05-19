import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';
import createTransactionMonitor from './mutation/createTransactionMonitor';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
    createTransactionMonitor,
  },
});
