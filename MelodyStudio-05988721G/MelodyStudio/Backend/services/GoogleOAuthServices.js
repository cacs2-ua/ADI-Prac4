//GoogleOAuthServices.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '887168670299-gi9rp3vrp5rjtratgagjs93hrrpg5jek.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Set up the Google OAuth2 strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  // This is where you can save or retrieve user data from a database
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
