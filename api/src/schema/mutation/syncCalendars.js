import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import syncCalendars from '../../lib/plaid/syncCalendars';

const SyncCalendarsPayloadType = new GraphQLObjectType({
  name: 'SyncCalendarPayload',
  fields: {
    status: { type: new GraphQLNonNull(GraphQLString) },
    errors: { type: new GraphQLList(GraphQLString) },
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
      const { status, errors } = await syncCalendars(itemId);

      if (errors && errors.length) {
        return { status: 'FAIL', errors };
      }

      return { status, errors };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e', e, e.message);
      return { status: 'FAIL', errors: [e && e.message] };
    }
  },
};
