// config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const admin = require('../firebase/firebase').admin;
const { db } = require('../firebase/firebase');

const GOOGLE_CLIENT_ID = '887168670299-8mtoiit81cnuithud2p78vmeqmksafn0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  try {
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
    } catch (error) {
      // Si el usuario no existe, créalo
      user = await admin.auth().createUser({
        email: email,
        displayName: profile.displayName,
        photoURL: profile.photos[0].value,
      });

      // Guardar usuario en Firestore
      await db.collection('users').doc(user.uid).set({
        email: email,
        displayName: profile.displayName,
        photoURL: profile.photos[0].value,
        createdAt: new Date(),
      });
    }

    // Verificar si el usuario existe en Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      // Si no existe, guardarlo
      await db.collection('users').doc(user.uid).set({
        email: email,
        displayName: profile.displayName,
        photoURL: profile.photos[0].value,
        createdAt: new Date(),
      });
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.uid);
});

passport.deserializeUser(async (uid, done) => {
  try {
    const user = await admin.auth().getUser(uid);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
