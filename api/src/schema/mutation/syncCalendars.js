import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
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
  },
  resolve: async (_, { itemId }) => {
    try {
      await syncCalendars(itemId);
      return { status: 'OK' };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e', e, e.message);
      return { status: 'FAIL' };
    }
  },
};
