import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

const SyncCalendarPayloadType = new GraphQLObjectType({
  name: 'SyncCalendarPayload',
  fields: {
    status: new GraphQLNonNull(GraphQLString),
  },
});

export default {
  name: 'syncCalendar',
  type: SyncCalendarPayloadType,
  args: {
    calendarEntityId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: () => {
    // TODO later; after webhook handlers are done
    //
    // Fetch transactions in the last 30 days
    // Divy up into dates
    // Create events!!!!!!!!!!!!!!!
  },
};
