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
  resolve: (_, args) => {
    // Fetch transactions in the last 30 days
    // Divy up into dates
    // Create events!!!!!!!!!!!!!!!
  },
};
