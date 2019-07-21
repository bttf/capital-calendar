import Queue from 'bull';

const { REDIS_HOST, REDIS_PASSWORD } = process.env;
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST, password: REDIS_PASSWORD } });

itemQueue.process((job, done) => {
  // eslint-disable-next-line no-console
  console.log('job.data', job.data);

  done();
});
