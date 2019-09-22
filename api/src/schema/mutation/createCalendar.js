import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../db';
import CalendarType, { CalendarCadenceEnumType } from '../calendar';
import { createGoogleCalendar } from '../../lib/google';

const CreateCalendarPayloadType = new GraphQLObjectType({
  name: 'CreateCalendarPayload',
  fields: {
    calendar: {
      type: new GraphQLNonNull(CalendarType),
    },
  },
});

export default {
  name: 'createCalendar',
  type: CreateCalendarPayloadType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    cadence: { type: new GraphQLNonNull(CalendarCadenceEnumType) },
    expenseAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
    incomeAccountIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
  },
  resolve: async (_, args, { googleAuth, viewer }) => {
    let calendar;
    const { name, cadence, expenseAccountIds = [], incomeAccountIds = [] } = args;

    if (!expenseAccountIds.length && !incomeAccountIds.length) {
      throw new Error('Need to select at least one account');
    }

    try {
      const googleCalendar = await createGoogleCalendar({
        googleAuth,
        name,
      });

      await db.sequelize.transaction(async transaction => {
        calendar = await db.Calendar.create(
          {
            name,
            cadence,
            userId: viewer.user.id,
            googleCalendarId: googleCalendar.id,
          },
          { transaction, returning: true },
        );

        // I don't know why these need to be snake-case to work. But
        // they do.
        const accountsCalendarsBulkAttrs = [
          ...expenseAccountIds.map(accountId => ({
            account_id: accountId,
            calendar_id: calendar.id,
            type: 'expenses',
          })),
          ...incomeAccountIds.map(accountId => ({
            account_id: accountId,
            calendar_id: calendar.id,
            type: 'income',
          })),
        ];

        await db.PlaidAccountsCalendars.bulkCreate(accountsCalendarsBulkAttrs, { transaction });
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('Error', e);
      throw e;
    }

    return { calendar };
  },
};
