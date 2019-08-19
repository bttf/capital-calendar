import db from '../db';
import fetchRecentTransactions from '../lib/plaid/fetchRecentTransactions';
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

    const { status, errors } = await fetchRecentTransactions(plaidItem, 30);

    return { status, errors };
  },
  removeTransactions: async args => {
    const [transactionIds] = args;

    if (!transactionIds || !transactionIds.length)
      throw new Error('RPC removeTransactions: No transaction ids specified');

    const { status, errors } = await removeTransactions(transactionIds);

    return { status, errors };
  },
};
