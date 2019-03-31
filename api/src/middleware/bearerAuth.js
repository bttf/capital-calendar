import { googleOAuthClient } from '../lib/auth';
import passport from '../middleware/passport';
import db from '../db';

export default (req, res, next) => {
  const unauthorizedResponse = () => {
    res.status(401).json({ errors: [{ message: 'Unauthorized' }] });
  };

  passport.authenticate('bearer', async (err, decodedUser) => {
    if (err || !decodedUser) return unauthorizedResponse();

    const user = await db.User.findByEntityId(decodedUser.entityId, {
      include: { association: db.User.GoogleAuth },
    });

    if (!user || !user.googleAuth) return unauthorizedResponse();

    const { accessToken, refreshToken } = user.googleAuth;

    googleOAuthClient.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // The googleOauthClient will automatically refresh tokens if they are out
    // of date. Set up a handler to update DB with new tokens if this happens.
    googleOAuthClient.on('tokens', tokens => {
      db.GoogleAuth.upsert({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        userId: user.id,
      });
    });

    req.user = user;

    next();
  })(req, res, next);
};
