import express from 'express';
import Queue from 'bull';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3002;
const { REDIS_HOST, REDIS_PASSWORD } = process.env;
const app = express();
const itemQueue = new Queue('plaid-item', { redis: { host: REDIS_HOST, password: REDIS_PASSWORD } });

// TODO possibly remove if not utilized
app.use(bodyParser.urlencoded({ extended: false }));

// TODO possibly remove if not utilized
app.use(bodyParser.json());

app.post('/plaid-item', (req, res, next) => {
  const requestBody = req.body;

  // eslint-disable-next-line no-console
  console.log('Receiving webhook', req.body, req.query, req.params);

  try {
    itemQueue.add({ requestBody });
  } catch(e) {
    return next();
  }

  res.send('OK');
});

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
