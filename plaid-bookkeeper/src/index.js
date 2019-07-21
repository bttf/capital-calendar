import Queue from 'bull';

const { REDIS_HOST } = process.env;
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST } });

itemQueue.process((job, done) => {
  // eslint-disable-next-line no-console
  console.log('job.data', job.data);

  done();
});
