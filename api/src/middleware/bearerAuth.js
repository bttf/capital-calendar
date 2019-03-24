import passport from '../middleware/passport';
import db from '../db';

export default (req, res, next) => {
  const unauthorizedResponse = () => {
    res.status(401).json({ errors: [{ message: 'Unauthorized' }] });
  };

  passport.authenticate('bearer', async (err, decodedUser) => {
    if (err || !decodedUser) {
      return unauthorizedResponse();
    }

    const user = await db.User.findByEntityId(decodedUser.entityId);
    if (!user) return unauthorizedResponse();

    req.user = user;
    next();
  })(req, res, next);
};
