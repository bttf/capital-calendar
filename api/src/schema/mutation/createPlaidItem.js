import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import plaid from 'plaid';
import db from '../../db';
const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } = process.env;

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
  resolve: async (_, { publicToken }, { viewer }) => {
    const plaidClient = new plaid.Client(
      PLAID_CLIENT_ID,
      PLAID_SECRET,
      PLAID_PUBLIC_KEY,
      plaid.environments.sandbox,
    );

    // Get access token
    const { item_id: itemId, access_token: accessToken } = await plaidClient.exchangePublicToken(
      publicToken,
    );

    // Upsert to: users_plaid_items
    //  - user_id
    //  - item_id
    //  - access_token
    try {
      await db.PlaidItem.upsert({
        itemId,
        accessToken,
        userId: viewer.user.id,
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      return {
        errors: ['Error creating item'],
      };
    }

    // Get and create accounts
    let accounts = [];
    try {
      ({ accounts } = await plaidClient.getAccounts(accessToken));
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      return {
        errors: ['Error fetching accounts'],
      };
    }

    try {
      await db.PlaidAccount.bulkCreate(
        accounts.map(a => ({
          accountId: a.account_id,
          name: a.name,
          officialName: a.official_name,
          mask: a.mask,
          subtype: a.subtype,
          plaidItemId: itemId,
        })),
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      return {
        errors: ['Error creating accounts'],
      };
    }

    return {
      status: 'OK',
    };
  },
};
