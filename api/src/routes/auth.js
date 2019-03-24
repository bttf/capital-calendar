import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();
const AUTH_SECRET = process.env.AUTH_SECRET;

/**
 * Generate a short-lived token for the client to use in conjunction with the
 * GitHub-provided code for the `authWithGithub` mutation.
 */
router.get('/github', (req, res, next) => {
  const token = jwt.sign({}, AUTH_SECRET, { expiresIn: '10m' });
  passport.authenticate('github', {
    state: token,
  })(req, res, next);
});

export default router;
