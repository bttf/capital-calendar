import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { google } from 'googleapis';
import db from '../../../db';
import { generateToken } from '../../../lib/auth';

const AuthWithGooglePayloadType = new GraphQLObjectType({
  name: 'AuthWithGooglePayload',
  fields: {
    token: {
      type: GraphQLString,
    },
    errors: { type: new GraphQLList(GraphQLString) },
  },
});

/**
 * This mutation is called when a user has auth'd with google, and is sent
 * back to our site with a generated code.
 *
 * We use that code to generate tokens via googleapis client, store tokens, and
 * send back the user a JWT that they can use for bearer auth.
 */
export default {
  name: 'authWithGoogle',
  type: AuthWithGooglePayloadType,
  args: {
    code: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { code }, { googleAuth }) => {
    let tokens;

    try {
      ({ tokens } = await googleAuth.getToken(code));
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return { errors: ['Unable to retrieve tokens using code'], token: null };
    }

    googleAuth.setCredentials(tokens);

    let email;
    let user;
    const { access_token: accessToken, refresh_token: refreshToken } = tokens;

    try {
      email = await new Promise((resolve, reject) => {
        google.oauth2('v2').userinfo.get({ auth: googleAuth }, (err, res) => {
          if (err) reject(err);
          resolve(res.data.email);
        });
      });

      if (!email) throw new Error('No email returned from google auth');

      [user] = await db.User.findOrCreate({
        where: { email },
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return { errors: ['An error occured', e && e.message], token: null };
    }

    try {
      await db.GoogleAuth.upsert({
        accessToken,
        refreshToken: refreshToken ? refreshToken : undefined,
        userId: user.id,
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return { errors: ['Unable to update tokens for user'], token: null };
    }

    return {
      token: generateToken(user.toJSON(), '365d'),
    };
  },
};
