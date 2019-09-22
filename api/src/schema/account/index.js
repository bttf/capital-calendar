import { GraphQLBoolean, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import InstitutionType from '../institution';

export default new GraphQLObjectType({
  name: 'Account',
  fields: {
    accountId: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    officialName: { type: GraphQLString },
    mask: { type: GraphQLString },
    subtype: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    itemPublicToken: { type: GraphQLString },
    institution: {
      type: InstitutionType,
      resolve: (account, _args, { loaders }) =>
        loaders.findOrCreateInstitutionById.load(account.plaidInstitutionId),
    },
    loginRequired: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: account => account.plaidItem.loginRequired,
    },
  },
});
