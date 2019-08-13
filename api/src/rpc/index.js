import fetchRecentTransactions from '../lib/plaid/fetchRecentTransactions';
import removeTransactions from '../lib/plaid/removeTransactions';

export default {
  fetchRecentTransactions: async args => {
    const [itemId] = args;

    if (!itemId) throw new Error('RPC fetchRecentTransactions: No itemId specified');

    const { status, errors } = await fetchRecentTransactions(itemId, 30);

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
