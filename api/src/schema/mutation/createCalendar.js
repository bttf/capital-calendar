import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../db';
import TransactionMonitorType, { TransactionMonitorCadenceEnumType } from '../transactionMonitor';

const CreateCalendarPayloadType = new GraphQLObjectType({
  name: 'CreateCalendarPayload',
  fields: {
    transactionMonitor: {
      type: new GraphQLNonNull(TransactionMonitorType),
    },
  },
});

export default {
  name: 'createCalendar',
  type: CreateCalendarPayloadType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    cadence: { type: new GraphQLNonNull(TransactionMonitorCadenceEnumType) },
    expenseAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
    incomeAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
  },
  resolve: async (_, args, { viewer }) => {
    let transactionMonitor;
    const { name, cadence, expenseAccountIds = [], incomeAccountIds = [] } = args;

    if (!expenseAccountIds.length && !incomeAccountIds.length) {
      throw new Error('Need to select at least one account');
    }

    try {
      await db.sequelize.transaction(async transaction => {
        transactionMonitor = await db.TransactionMonitor.create(
          {
            // TODO Don't think name needs to be on transaction monitor anymore?
            name,
            cadence,
            userId: viewer.user.id,
          },
          { transaction, returning: true },
        );

        // I don't know why these need to be snake-case to work. But
        // they do.
        await db.PlaidAccountsTransactionMonitors.bulkCreate(
          expenseAccountIds.map(accountId => ({
            account_id: accountId,
            transaction_monitor_id: transactionMonitor.id,
            type: 'expenses',
          })),
          { transaction },
        );

        await db.PlaidAccountsTransactionMonitors.bulkCreate(
          incomeAccountIds.map(accountId => ({
            account_id: accountId,
            transaction_monitor_id: transactionMonitor.id,
            type: 'income',
          })),
          { transaction },
        );
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      throw e;
    }

    return { transactionMonitor };
  },
};
