import { GraphQLObjectType } from 'graphql';
import createUser from './user/mutations/createUser';
import createBoard from './topic/mutations/createBoard';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser,
    createBoard,
  },
});
