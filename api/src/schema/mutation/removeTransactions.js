import { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import removeTransactions from '../../lib/plaid/removeTransactions';

const RemoveTransactionsPayloadType = new GraphQLObjectType({
  name: 'RemoveTransactionsPayload',
  fields: {
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    errors: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

// NOTE: This is not being used yet.
export default {
  name: 'removeTransactions',
  type: RemoveTransactionsPayloadType,
  description: 'Remove transactions by entity id',
  args: {
    transactionIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
  },
  resolve: async (_, { transactionIds }) => {
    const { status, errors } = await removeTransactions(transactionIds);

    if (errors && errors.length) return { errors };

    return { status, errors: [] };
  },
};
