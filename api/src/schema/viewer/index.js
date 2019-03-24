import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../db';
import UserType from '../user';
import TopicType from '../topic';

export default new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    user: {
      type: UserType,
    },
    boards: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TopicType))),
      resolve: async source => {
        const boards = await db.Topic.getBoardsOfUser(source.user);
        return boards;
      },
    },
  },
});
