import express from 'express';
import bull from 'bull';

const PORT = process.env.PORT || 3002;
const app = express();

app.get('/plaid-item', (req, res, next) => {
  next();
});

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
