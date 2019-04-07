import { GraphQLObjectType } from 'graphql';
import createPlaidItem from './mutation/createPlaidItem';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPlaidItem,
  },
});
