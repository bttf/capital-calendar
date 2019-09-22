import passport from 'passport';
import bearerStrategy from './bearerStrategy';

passport.use(bearerStrategy);

// TODO Assert if we need these two methods defined
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
