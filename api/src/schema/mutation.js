import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';
import createCalendar from './mutation/createCalendar';
import handleInitialUpdate from './mutation/handleInitialUpdate';
import syncCalendars from './mutation/syncCalendars';
import removeTransactions from './mutation/removeTransactions';
import markItemAsLoggedIn from './mutation/markItemAsLoggedIn';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
    createCalendar,
    handleInitialUpdate,
    syncCalendars,
    removeTransactions,
    markItemAsLoggedIn,
  },
});
