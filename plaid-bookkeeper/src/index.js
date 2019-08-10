import Queue from 'bull';
import { fetchRecentTransactions } from './rpc';

const { REDIS_HOST, REDIS_PASSWORD } = process.env;
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST, password: REDIS_PASSWORD } });

itemQueue.process(async (job, done) => {
  // eslint-disable-next-line no-console
  console.log('Received payload', job.data, '\n');

  const { data } = job;

  if (!data) return;

  const { item_id: itemId, webhook_type, webhook_code } = data;

  if (webhook_type !== 'TRANSACTIONS') {
    return;
  }

  if (webhook_code === 'INITIAL_UPDATE') {
    try {
      await fetchRecentTransactions(itemId);
      // TODO: remove job from queue
    } catch(e) {
      // eslint-disable-next-line no-console
      console.log('Error', e);
    }
  }

  done();
});

// DEBUG
// For testing RPC flow
// 
// const main = async () => {
//   try {
//     await fetchRecentTransactions('test');
//   } catch(e) {
//     console.log('error', e);
//   }
// }

// main();
