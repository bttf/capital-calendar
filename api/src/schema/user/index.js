import { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import AccountsType from '../account';
import db from '../../db';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
    accounts: {
      type: new GraphQLList(AccountsType),
      args: {
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: (user, args) => {
        return db.PlaidAccount.findAll({
          where: { userId: user.id },
          offset: args.offset || undefined,
          limit: args.limit || undefined,
          order: [['createdAt', 'DESC'], ['accountId', 'ASC']],
        });
      },
    },
  },
});
