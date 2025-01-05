//GoogleOAuthRoutes.js

const express = require('express');
const passport = require('passport');
const authController = require('../controllers/GoogleOAuthController');

const router = express.Router();

// Home page route
router.get('/', authController.homePage);

// Google authentication route
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google authentication callback route
router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

// Protected route
router.get('/protected', authController.isLoggedIn, authController.protectedPage);

// Logout route
router.get('/logout', authController.logout);

// Failure route
router.get('/auth/google/failure', authController.googleAuthFailure);

module.exports = router;


