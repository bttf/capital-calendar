import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';
import createCalendar from './mutation/createCalendar';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
    createCalendar,
  },
});
