import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../db';
import AccountType from '../account';

const CreatePlaidItemPayloadType = new GraphQLObjectType({
  name: 'CreatePlaidItemPayload',
  fields: {
    accounts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AccountType))),
    },
  },
});

export default {
  name: 'createPlaidItem',
  type: CreatePlaidItemPayloadType,
  args: {
    publicToken: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { publicToken }, { plaidClient, viewer }) => {
    let createdAccounts;

    try {
      await db.sequelize.transaction(async transaction => {
        const {
          item_id: itemId,
          access_token: accessToken,
        } = await plaidClient.exchangePublicToken(publicToken);
        const { item } = await plaidClient.getItem(accessToken);
        const institutionId = item && item.institution_id;

        await db.PlaidItem.upsert(
          {
            itemId,
            accessToken,
            plaidInstitutionId: institutionId,
            userId: viewer.user.id,
          },
          { transaction },
        );

        const { accounts } = await plaidClient.getAccounts(accessToken);

        createdAccounts = await db.PlaidAccount.bulkCreate(
          accounts.map(a => ({
            accountId: a.account_id,
            name: a.name,
            officialName: a.official_name,
            mask: a.mask,
            subtype: a.subtype,
            userId: viewer.user.id,
            plaidItemId: itemId,
            plaidInstitutionId: institutionId,
          })),
          { transaction, returning: true },
        );
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      return {
        errors: ['Error creating item'],
      };
    }

    return { accounts: createdAccounts };
  },
};
