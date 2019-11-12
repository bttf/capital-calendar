import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../db';
import CalendarType from '../calendar';

const EditCalendarPayloadType = new GraphQLObjectType({
  name: 'EditCalendarPayload',
  fields: {
    calendar: {
      type: new GraphQLNonNull(CalendarType),
    },
  },
});

export default {
  name: 'editCalendar',
  type: EditCalendarPayloadType,
  args: {
    calendarEntityId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    expenseAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
    incomeAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
  },
  resolve: async (_, args) => {
    const { calendarEntityId, expenseAccountIds, incomeAccountIds } = args;

    const calendar = await db.Calendar.findOne({ where: { entityId: calendarEntityId } });

    if (!calendar) return { errors: ['No calendar found'] };

    await db.sequelize.transaction(async transaction => {
      await db.PlaidAccountsCalendars.destroy({
        where: { calendar_id: calendar.id },
        transaction,
      });

      await db.PlaidAccountsCalendars.bulkCreate(
        expenseAccountIds.map(accountId => ({
          account_id: accountId,
          calendar_id: calendar.id,
          type: 'expenses',
        })),
        { transaction },
      );

      await db.PlaidAccountsCalendars.bulkCreate(
        incomeAccountIds.map(accountId => ({
          account_id: accountId,
          calendar_id: calendar.id,
          type: 'income',
        })),
        { transaction },
      );
    });
  },
};
