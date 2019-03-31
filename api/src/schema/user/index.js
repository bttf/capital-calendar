import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import CalendarType from '../calendar';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    calendars: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CalendarType))),
      resolve: () => {
        return [
          {
            name: 'Calendar #1',
          },
          {
            name: 'Calendar #2',
          },
        ];
      },
    },
  },
});
