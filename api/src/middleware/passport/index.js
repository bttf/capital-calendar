import passport from 'passport';
import bearerStrategy from './bearerStrategy';

passport.use(bearerStrategy);

passport.serializeUser((user, cb) => {
  // eslint-disable-next-line
  console.log('DEBUG serializeUser', user);
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  // eslint-disable-next-line
  console.log('DEBUG deserializeUser', obj);
  cb(null, obj);
});

export default passport;
