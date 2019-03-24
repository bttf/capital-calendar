import { GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../../db';
import TopicType from '../';

export default {
  name: 'createBoard',
  type: TopicType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, { viewer }) => {
    const { name } = args;
    const existingBoard = await db.Topic.getBoardBySlug(name);

    if (existingBoard) {
      throw new Error('Board already exists');
    }

    const board = await db.Topic.create({
      title: name,
      slug: name,
      isCollection: true,
      parent_id: null,
      created_by: viewer.user.id,
    });

    return board;
  },
};
