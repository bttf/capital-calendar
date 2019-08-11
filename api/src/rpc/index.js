import fetchRecentTransactions from '../lib/plaid/fetchRecentTransactions';

export default {
  fetchRecentTransactions: async args => {
    const [itemId] = args;

    if (!itemId) throw new Error('RPC fetchRecentTransactions: No itemId specified');

    const { status, errors } = await fetchRecentTransactions(itemId, 30);

    // eslint-disable-next-line no-console
    console.log('DEBUG fetchRecentTransactions response', { status, errors });

    return { status, errors };
  },
};
