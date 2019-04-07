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
    await db.PlaidItem.upsert({
      itemId,
      accessToken,
      userId: viewer.user.id,
    });

    //  TODO: background jobs

    // Return OK
    return {
      status: 'OK',
    };
  },
};
