import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../db';

const CreatePlaidItemPayloadType = new GraphQLObjectType({
  name: 'CreatePlaidItemPayload',
  fields: {
    // TODO return whatever graphql type we decide to represent a saved/connected
    // bank.
    status: {
      type: GraphQLString,
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
    // Get access token
    // Upsert to: users_plaid_items
    //  - user_id
    //  - item_id
    //  - access_token
    // Get and create accounts
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
            institutionId,
            userId: viewer.user.id,
          },
          { transaction },
        );

        const { accounts } = await plaidClient.getAccounts(accessToken);

        await db.PlaidAccount.bulkCreate(
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
          { transaction },
        );
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      return {
        errors: ['Error creating item'],
      };
    }

    return {
      status: 'OK',
    };
  },
};
