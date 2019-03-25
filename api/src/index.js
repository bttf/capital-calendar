import express from 'express';
import graphqlHTTP from 'express-graphql';
import passport from './middleware/passport';
import schema from './schema';
import publicSchema from './schema/publicSchema';
import authRoutes from './routes/auth';
import cors from 'cors';
// import bearerAuth from './middleware/bearerAuth';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/public/graphql', graphqlHTTP({ schema: publicSchema }));
app.use('/graphql', async (req, res, next) => {
  const context = { viewer: { user: req.user } };
  return graphqlHTTP({
    schema,
    context,
  })(req, res, next);
});

app.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log(`listening to port ${PORT}`);
});
