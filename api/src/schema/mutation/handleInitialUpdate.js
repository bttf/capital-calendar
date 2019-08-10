import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import moment from 'moment';
import db from '../../db';

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
  resolve: async (_, { itemId }, { plaidClient }) => {
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const thirtyDaysAgo = now.subtract(30, 'days').format('YYYY-MM-DD');

    const { accessToken } = await db.PlaidItem.findOne({
      where: { itemId },
    });

    if (!accessToken) {
      return { status: 'No access token found' };
    }

    const response = await plaidClient.getTransactions(accessToken, thirtyDaysAgo, today);

    // eslint-disable-next-line no-console
    console.log('DEBUG: response', response);

    return { status: 'OK' };
  },
};
