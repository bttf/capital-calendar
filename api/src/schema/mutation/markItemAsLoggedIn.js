import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import db from '../../db';

const MarkItemAsLoggedInPayloadType = new GraphQLObjectType({
  name: 'MarkItemAsLoggedInPayload',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

export default {
  name: 'markItemAsLoggedIn',
  type: MarkItemAsLoggedInPayloadType,
  args: {
    itemId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { itemId }, { viewer }) => {
    const plaidItem = await db.PlaidItem.findOne({
      where: { itemId, user_id: viewer.user.id },
    });

    try {
      await plaidItem.update({ loginRequired: false });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `${new Date().toLocaleString()} markItemLoginRequired - An error occured`,
        (e && e.message) || e,
      );
      return { success: false };
    }

    return { success: true };
  },
};
