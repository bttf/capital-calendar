import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Calendar',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
