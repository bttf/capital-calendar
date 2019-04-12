import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from './middleware/passport';
import schema from './schema';
import publicSchema from './schema/publicSchema';
import authRoutes from './routes/auth';
import cors from 'cors';
import { genGoogleOAuthClient } from './lib/auth';
import bearerAuth from './middleware/bearerAuth';
import plaidClient from './lib/plaid/client';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.use('/public/graphql', async (req, res, next) => {
  const context = { googleAuth: genGoogleOAuthClient() };
  return graphqlHTTP({
    context,
    schema: publicSchema,
  })(req, res, next);
});

app.use('/graphql', bearerAuth, async (req, res, next) => {
  const context = {
    plaidClient,
    googleAuth: req.googleAuth,
    viewer: { user: req.user },
  };
  return graphqlHTTP({
    schema,
    context,
  })(req, res, next);
});

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
