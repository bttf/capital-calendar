import express from 'express';
import bodyParser from 'body-parser';
import Queue from 'bull';

const { PORT = 3002, REDIS_HOST, REDIS_PASSWORD } = process.env;
const app = express();
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST, password: REDIS_PASSWORD } });

app.use(bodyParser.json());

app.post('/plaid-item', (req, res, next) => {
  const requestBody = req.body;

  // eslint-disable-next-line no-console
  console.log('Receiving webhook', req.body, req.query, req.params);

  if (!requestBody || !requestBody.webhook_type || !requestBody.webhook_code) return res.send('NUH-UH');

  try {
    itemQueue.add(requestBody);
  } catch(e) {
    console.log('ERROR: Could not add to queue;', e);
    return next();
  }

  res.send('OK');
});

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
