import passport from 'passport';
import bearerStrategy from './bearerStrategy';
// import githubStrategy from './githubStrategy';

passport.use(bearerStrategy);
// passport.use(githubStrategy);

passport.serializeUser((user, cb) => {
  console.log('DEBUG serializeUser', user);
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  console.log('DEBUG deserializeUser', obj);
  cb(null, obj);
});

export default passport;
