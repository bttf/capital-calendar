import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import db from '../../../db';
import { githubOAuth, generateToken } from '../../../lib/auth';

const AuthWithGitHubPayloadType = new GraphQLObjectType({
  name: 'AuthWithGitHubPayload',
  fields: {
    token: {
      type: new GraphQLNonNull(GraphQLString),
    },
    githubToken: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export default {
  name: 'authWithGitHub',
  type: AuthWithGitHubPayloadType,
  args: {
    code: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    const { code, state } = args;

    let accessToken;
    let refreshToken;
    try {
      [accessToken, refreshToken] = await githubOAuth.getTokens(code, state);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return { errors: [{ message: 'An error occured' }], token: null };
    }

    let githubUser;
    try {
      githubUser = await githubOAuth.getUser(accessToken);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return { errors: [{ message: 'An error occured' }], token: null };
    }

    const [userAuth, created] = await db.UserAuth.findOrCreate({
      where: { githubID: githubUser.id },
      include: { association: db.UserAuth.User },
    });

    let user;
    if (created || !userAuth.user) {
      const { email } = githubUser.emails.find(email => email.primary) || {};

      user = await db.User.create({
        email,
        username: githubUser.username,
      });
    } else {
      user = userAuth.user;
    }

    await userAuth.update({
      userID: user.id,
      githubAccessToken: accessToken,
      githubRefreshToken: refreshToken,
    });

    return {
      token: generateToken(
        {
          entityId: user.entityId,
          username: user.username,
        },
        '365d',
      ),
      githubToken: accessToken,
    };
  },
};
