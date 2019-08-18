import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import fetchRecentTransactions from '../../lib/plaid/fetchRecentTransactions';

const FetchRecentTransactionsPayloadType = new GraphQLObjectType({
  name: 'FetchRecentTransactionsPayload',
  fields: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
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
    const { status, errors } = await fetchRecentTransactions(itemId, 30);

    if (errors && errors.length) return { status: 'FAIL', errors };

    return { status };
  },
};
