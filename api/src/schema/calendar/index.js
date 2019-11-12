import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';

import db from '../../db';
import AccountType from '../account';

export const CalendarCadenceEnumType = new GraphQLEnumType({
  name: 'CalendarCadenceEnum',
  values: {
    DAILY: { value: 'daily' },
    WEEKLY: { value: 'weekly' },
    MONTHLY: { value: 'monthly' },
  },
});

export default new GraphQLObjectType({
  name: 'Calendar',
  fields: {
    entityId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    cadence: {
      type: new GraphQLNonNull(CalendarCadenceEnumType),
    },
    googleCalendarInSync: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    backgroundColor: {
      type: GraphQLString,
    },
    incomeAccounts: {
      type: new GraphQLList(AccountType),
      resolve: async calendar => {
        const plaidAccountCalendars = await db.PlaidAccountsCalendars.findAll({
          where: { calendar_id: calendar.id },
        });
        const incomeCalendars = plaidAccountCalendars.filter(c => c.type === 'income');
        return Promise.all(incomeCalendars.map(c => c.getPlaidAccount()));
      },
    },
    expenseAccounts: {
      type: new GraphQLList(AccountType),
      resolve: async calendar => {
        const plaidAccountCalendars = await db.PlaidAccountsCalendars.findAll({
          where: { calendar_id: calendar.id },
        });
        const incomeCalendars = plaidAccountCalendars.filter(c => c.type === 'expenses');
        return Promise.all(incomeCalendars.map(c => c.getPlaidAccount()));
      },
    },
  },
});
