import { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
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
      resolve: user => {
        return db.PlaidAccount.findAll({
          where: {
            userId: user.id,
          },
        });
      },
    },
  },
});
