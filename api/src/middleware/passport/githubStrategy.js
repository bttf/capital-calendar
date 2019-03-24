import { Strategy as GitHubStrategy } from 'passport-github';
import db from '../../db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

export default new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    scope: [
      'user',
      'public_repo',
      'repo',
      'repo_deployment',
      'repo:status',
      'read:repo_hook',
      'read:org',
      'read:public_key',
      'read:gpg_key',
    ],
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const [userAuth, created] = await db.UserAuth.findOrCreate({
        where: { githubID: profile.id },
        include: { association: db.UserAuth.User },
      });

      let user;
      if (created) {
        const { email } = profile.emails.find(email => email.primary) || {};
        user = await db.User.create({
          email,
          username: profile.username,
        });
        await userAuth.update({ userID: user.id });
      } else {
        user = userAuth.user;
      }

      cb(null, user);
    } catch (e) {
      cb(e, null);
    }
  },
);
