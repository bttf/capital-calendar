import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import mutation from './mutation';

export default new GraphQLSchema({
  mutation,
  query: new GraphQLObjectType({
    name: 'PublicQuery',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hi',
      },
    },
  }),
});
