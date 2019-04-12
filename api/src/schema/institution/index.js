import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Institution',
  fields: {
    institutionId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    primaryColor: { type: GraphQLString },
    url: { type: GraphQLString },
    logo: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  },
});
