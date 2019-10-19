import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import db from '../../db';
import fetchRecentTransactions from '../../lib/plaid/fetchRecentTransactions';
import syncCalendars from '../../lib/plaid/syncCalendars';

const SyncCalendarsPayloadType = new GraphQLObjectType({
  name: 'SyncCalendarPayload',
  fields: {
    status: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default {
  name: 'syncCalendars',
  type: SyncCalendarsPayloadType,
  args: {
    itemId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    fetchTransactions: {
      type: GraphQLBoolean,
    },
  },
  resolve: async (_, { fetchTransactions, itemId }, { viewer }) => {
    try {
      if (fetchTransactions) {
        const plaidItem = await db.PlaidItem.findOne({
          where: { itemId, user_id: viewer.user.id },
        });

        await fetchRecentTransactions(plaidItem);
      }

      await syncCalendars(itemId);
      return { status: 'OK' };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e', e, e.message);
      return { status: 'FAIL' };
    }
  },
};
