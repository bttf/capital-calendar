import express from 'express';
import graphqlHTTP from 'express-graphql';
import bodyParser from 'body-parser';
import rpc from 'jayson/promise';
import cors from 'cors';

import { genLoaders } from './lib/loaders';
import { genGoogleOAuthClient } from './lib/auth';
import plaidClient from './lib/plaid/client';

import passport from './middleware/passport';
import bearerAuth from './middleware/bearerAuth';
import rpcAuth from './middleware/rpcAuth';

import schema from './schema';
import publicSchema from './schema/publicSchema';
import rpcMethods from './rpc';

const PORT = process.env.PORT || 3000;
const app = express();
const rpcServer = rpc.server(rpcMethods);

app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());

app.use('/public/graphql', async (req, res, next) => {
  const context = { googleAuth: await genGoogleOAuthClient() };
  return graphqlHTTP({
    context,
    schema: publicSchema,
  })(req, res, next);
});

app.use('/graphql', bearerAuth, async (req, res, next) => {
  const loaders = genLoaders();
  const context = {
    loaders,
    plaidClient,
    googleAuth: req.googleAuth,
    viewer: { user: req.user },
  };
  return graphqlHTTP({
    schema,
    context,
  })(req, res, next);
});

app.use(rpcAuth, rpcServer.middleware());

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
