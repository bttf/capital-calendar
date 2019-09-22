import Queue from 'bull';
import { fetchRecentTransactions, markItemLoginRequired, removeTransactions } from './rpc';

const { REDIS_HOST, REDIS_PASSWORD } = process.env;
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST, password: REDIS_PASSWORD } });

/**
 * Big f'in TODO here; we need to remove jobs from redis queue when successfully
 * taken care of.
 */
itemQueue.process(async (job, done) => {
  // eslint-disable-next-line no-console
  console.log('\n===\nReceived payload', job.data, '\n');

  const { data } = job;

  if (!data) return;

  const { error, item_id: itemId, webhook_type, webhook_code } = data;
  const { error_code } = error || {};

  if (webhook_type !== 'TRANSACTIONS') {
    return;
  }

  if (webhook_code === 'INITIAL_UPDATE' || webhook_code === 'DEFAULT_UPDATE') {
    await fetchRecentTransactions(itemId);
  }

  if (webhook_code === 'TRANSACTIONS_REMOVED') {
    const transactionIds = data.removed_transactions;
    await removeTransactions(transactionIds);
  }

  if (error_code === 'ITEM_LOGIN_REQUIRED') {
    await markItemLoginRequired(itemId);
  }

  done();
});
