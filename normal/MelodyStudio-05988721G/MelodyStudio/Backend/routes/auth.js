// Backend/routes/auth.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); 

// Rutas de autenticación
router.post('/signup-client', authController.signupClient);
router.post('/signup-admin', authController.signupAdmin);
router.post('/signup-musician', authController.signupMusician);
router.post('/login', authController.login);
router.post('/signout', authController.signout);
router.post('/forgot-password', authController.forgotPassword);

// Ruta protegida que devuelve datos del usuario
router.get('/protected', authenticateToken, authController.getProtectedData);

// Iniciar autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

module.exports = router;
