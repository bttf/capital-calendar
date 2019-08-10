import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';
import createCalendar from './mutation/createCalendar';
import handleInitialUpdate from './mutation/handleInitialUpdate';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
    createCalendar,
    handleInitialUpdate,
  },
});
