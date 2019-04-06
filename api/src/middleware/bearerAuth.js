import { genGoogleOAuthClient } from '../lib/auth';
import passport from '../middleware/passport';
import db from '../db';

export default (req, res, next) => {
  const unauthorizedResponse = () => {
    res.status(401).json({ errors: [{ message: 'Unauthorized' }] });
  };

  passport.authenticate('bearer', async (err, decodedUser) => {
    if (err || !decodedUser) return unauthorizedResponse();

    const googleOAuthClient = genGoogleOAuthClient();
    const user = await db.User.findByEntityId(decodedUser.entityId, {
      include: { association: db.User.GoogleAuth },
    });

    if (!user || !user.googleAuth) return unauthorizedResponse();

    const { accessToken, refreshToken } = user.googleAuth;

    googleOAuthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    /**
     * If we don't have a refresh token, we can't rely on google client to
     * refresh itself. So we manually validate the token here and kick off
     * the user if the token is invalid for them to reauth manually.
     */
    if (!refreshToken) {
      try {
        await googleOAuthClient.getTokenInfo(accessToken);
      } catch (e) {
        return unauthorizedResponse();
      }
    }

    // The googleOauthClient will automatically refresh tokens if they are out
    // of date. Set up a handler to update DB with new tokens if this happens.
    googleOAuthClient.on('tokens', tokens => {
      db.GoogleAuth.upsert({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        userId: user.id,
      });
    });

    req.user = user.toJSON();
    req.googleAuth = googleOAuthClient;

    next();
  })(req, res, next);
};
