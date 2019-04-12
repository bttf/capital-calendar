import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import InstitutionType from '../institution';
import createInstitution from '../../lib/institution/createInstitution';
import db from '../../db';

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
    institution: {
      type: InstitutionType,
      resolve: async account => {
        // TODO Use dataloader
        const institutionId = account.plaidInstitutionId;

        let institution = await db.PlaidInstitution.findOne({
          where: { institutionId },
        });

        if (!institution) {
          institution = await createInstitution(institutionId);
        }

        return institution;
      },
    },
  },
});
