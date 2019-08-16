import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';
import createCalendar from './mutation/createCalendar';
import handleInitialUpdate from './mutation/handleInitialUpdate';
import removeTransactions from './mutation/removeTransactions';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
    createCalendar,
    handleInitialUpdate,
    removeTransactions,
  },
});
