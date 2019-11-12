import db from '../db';
import fetchRecentTransactions from '../lib/plaid/fetchRecentTransactions';
import syncCalendars from '../lib/plaid/syncCalendars';
import removeTransactions from '../lib/plaid/removeTransactions';

export default {
  fetchRecentTransactions: async args => {
    const [itemId] = args;

    if (!itemId) throw new Error('RPC fetchRecentTransactions: No itemId specified');

    let plaidItem;

    try {
      plaidItem = await db.PlaidItem.findOne({
        where: { itemId },
      });
    } catch (e) {
      return { errors: ['Error fetching plaid item'] };
    }

    if (!plaidItem) {
      return { errors: ['Could not find plaid item'] };
    }

    let status;
    let errors;
    try {
      ({ status, errors } = await fetchRecentTransactions(plaidItem, 30));
    } catch (e) {
      const err = (e && e.message) || e;
      return { errors: ['Could not fetch recent transactions', err] };
    }

    try {
      await syncCalendars(itemId);
    } catch (e) {
      const err = (e && e.message) || e;

      // eslint-disable-next-line no-console
      console.error(e.stack);

      return { errors: ['Could not sync calendars', err] };
    }

    // TODO abstract this out
    try {
      await db.PlaidItem.update(
        {
          loginRequired: false,
        },
        {
          where: {
            itemId,
            loginRequired: true,
          },
        },
      );
    } catch (e) {
      const err = (e && e.message) || e;
      return { errors: ['Error updating plaid item', err] };
    }

    return { status, errors };
  },

  removeTransactions: async args => {
    const [transactionIds] = args;

    if (!transactionIds || !transactionIds.length)
      throw new Error('RPC removeTransactions: No transaction ids specified');

    const { status, errors } = await removeTransactions(transactionIds);

    return { status, errors };
  },

  markItemLoginRequired: async args => {
    const [itemId] = args;

    if (!itemId) throw new Error('RPC markItemLoginRequired: itemId cannot be null or undefined');

    let status = 'OK';
    let errors = [];

    try {
      await db.PlaidItem.update(
        {
          loginRequired: true,
        },
        {
          where: {
            itemId,
            loginRequired: false,
          },
        },
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('API RPC markItemLoginRequired error - ', e.message, e.stack);
      status = 'FAIL';
      errors = [e.message];
    }

    return { status, errors };
  },
};
