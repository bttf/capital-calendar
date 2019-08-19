import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql';
import db from '../../db';
import fetchRecentTransactions from '../../lib/plaid/fetchRecentTransactions';

const FetchRecentTransactionsPayloadType = new GraphQLObjectType({
  name: 'FetchRecentTransactionsPayload',
  fields: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    errors: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

// NOTE: This is not being used yet.
export default {
  name: 'fetchRecentTransactions',
  type: FetchRecentTransactionsPayloadType,
  description: 'Fetches last 30 days of transactions for given item',
  args: {
    itemId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_, { itemId }) => {
    let plaidItem;

    try {
      plaidItem = await db.PlaidItem.findOne({
        where: { itemId },
      });
    } catch (e) {
      return { status: 'FAIL', errors: ['Error fetching plaid item'] };
    }

    if (!plaidItem) {
      return { status: 'FAIL', errors: ['Could not find plaid item'] };
    }

    const { status, errors } = await fetchRecentTransactions(plaidItem, 30);

    if (errors && errors.length) return { status: 'FAIL', errors };

    return { status, errors: [] };
  },
};
