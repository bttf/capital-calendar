import express from 'express';

const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
