import moment from 'moment';
import Promise from 'bluebird';
import { google } from 'googleapis';
import { rangeRight, uniq } from 'lodash';

import { genGoogleOAuthClient } from '../../lib/auth';
import upsertCalendarEvents from './upsertCalendarEvents';
import db from '../../db';

const THIRTY_DAYS = 30;
const Op = db.Sequelize.Op;

/**
 * Sync transactions from the last 30 days with calendar events from the last
 * 30 days.
 *
 * TODO Optimize SQL queries
 */
export default async itemId => {
  const thirtyDaysAgo = moment()
    .subtract(THIRTY_DAYS, 'days')
    .format('YYYY-MM-DD');

  /**
   * First we grab all transactions in the last 30 days, and organize them by
   * account id
   */
  const item = await db.PlaidItem.findOne({
    where: { itemId },
    include: [{ association: db.PlaidItem.PlaidAccounts }, { association: db.PlaidItem.User }],
  });
  const accountIds = item.accounts.map(a => a.accountId);
  const userId = item.userId;
  const transactions = await db.PlaidTransaction.findAll({
    where: {
      accountId: accountIds,
      date: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  /**
   * Then, we fetch all calendars belonging to this user, and iterate through
   * each calendar.
   */
  const calendars = await db.Calendar.findAll({
    where: { userId },
    include: { model: db.PlaidAccount, as: 'plaidAccounts' },
  });

  // This is needed to identify expense vs. income accounts
  // TODO Condense this query and the above query into one.
  const plaidAccountsCalendars = await db.PlaidAccountsCalendars.findAll({
    where: { calendarId: calendars.map(c => c.id) },
  });

  await Promise.each(calendars, async calendar => {
    // accounts associated with this calendar
    const calendarAccountIds = uniq(calendar.plaidAccounts.map(a => a.accountId));

    // transactions associated with those accounts
    const calendarTransactions = transactions.filter(t => calendarAccountIds.includes(t.accountId));

    const generatedEvents = [];

    // iterate through the last 30 days
    rangeRight(THIRTY_DAYS).forEach(daysAgo => {
      const dateOf = moment()
        .subtract(daysAgo, 'days')
        .format('YYYY-MM-DD');

      // get transactions on this date
      const dateTransactions = calendarTransactions.filter(t => t.date === dateOf);

      // calculate income / expenses
      const [sumExpenses, sumIncome, expenseNames, incomeNames] = dateTransactions.reduce(
        (acc, t) => {
          const [expenses, income, expNames, incNames] = acc;
          const amount = parseFloat(t.amount);

          if (amount > 0) {
            return [expenses + amount, income, [...expNames, t.name], incNames];
          }

          return [expenses, income - amount, expNames, [...incNames, t.name]];
        },
        [0, 0, [], []],
      );

      // gather account settings (to monitor expenses or income)
      const calendarSettings = plaidAccountsCalendars
        .filter(c => c.calendarId === calendar.id)
        .map(s => s.type);

      if (calendarSettings.includes('expenses')) {
        if (!dateTransactions || !dateTransactions.length) {
          // TODO find or create empty event here
          return generatedEvents.push({
            date: dateOf,
            summary: '0',
            type: 'expenses',
            // TODO Replace this with actual color id for red
            colorId: 'red',
            calendarId: calendar.id,
            googleCalendarId: calendar.googleCalendarId,
          });
        }

        generatedEvents.push({
          date: dateOf,
          summary: sumExpenses.toFixed(2),
          description: expenseNames.map(n => `- ${n}`).join('\n'),
          type: 'expenses',
          // TODO Replace this with actual color id for red
          colorId: 'red',
          calendarId: calendar.id,
          googleCalendarId: calendar.googleCalendarId,
        });
      }

      if (calendarSettings.includes('income')) {
        if (!dateTransactions || !dateTransactions.length) {
          // TODO find or create empty event here
          return generatedEvents.push({
            date: dateOf,
            summary: '0',
            type: 'income',
            // TODO Replace this with actual color id for green
            colorId: 'green',
            calendarId: calendar.id,
            googleCalendarId: calendar.googleCalendarId,
          });
        }

        generatedEvents.push({
          date: dateOf,
          summary: sumIncome.toFixed(2),
          description: incomeNames.map(n => `- ${n}`).join('\n'),
          type: 'income',
          // TODO Replace this with actual color id for green
          colorId: 'green',
          calendarId: calendar.id,
          googleCalendarId: calendar.googleCalendarId,
        });
      }
    });

    await upsertCalendarEvents(generatedEvents, calendar.id);
  });

  const events = await db.CalendarEvent.findAll({
    where: {
      date: {
        [Op.gte]: thirtyDaysAgo,
      },
      calendarId: calendars.map(c => c.id),
    },
  });

  const googleAuth = await genGoogleOAuthClient(item.user);
  const calendarAPI = google.calendar({ version: 'v3', auth: googleAuth });

  const gCalEvents = await calendarAPI.events.list({
    calendarId: events[0].googleCalendarId,
    timeMin: new Date(thirtyDaysAgo).toJSON(),
  });
  const existingEvents = gCalEvents.data.items;
  const existingEventIds = existingEvents.map(e => e.id);

  await Promise.mapSeries(events, async e => {
    const eventId = e.eventId.replace(/-/g, '');
    try {
      if (existingEventIds.includes(eventId)) {
        await calendarAPI.events.update({
          eventId,
          calendarId: e.googleCalendarId,
          resource: {
            id: eventId,
            // TODO Include colorId here when appropriate
            start: { date: e.date },
            end: { date: e.date },
            summary: e.summary,
            description: e.description,
          },
        });
      } else {
        await calendarAPI.events.insert({
          calendarId: e.googleCalendarId,
          resource: {
            id: eventId,
            // TODO Include colorId here when appropriate
            start: { date: e.date },
            end: { date: e.date },
            summary: e.summary,
            description: e.description,
          },
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ERROR syncCalendars', e);
      throw new Error(e);
    }
  });
};
