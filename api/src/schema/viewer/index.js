import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import UserType from '../user';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hi',
    },
    user: {
      type: new GraphQLNonNull(UserType),
    },
  },
});
