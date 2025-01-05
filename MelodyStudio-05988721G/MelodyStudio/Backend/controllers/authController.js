// Backend/controllers/authController.js

const authService = require('../services/authService');
const { db } = require('../firebase/firebase');
const admin = require('../firebase/firebase').admin;

async function signupClient(req, res) {
  const { email, password, displayName } = req.body;
  try {
    const data = await authService.signupClient(email, password, { displayName });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function signupAdmin(req, res) {
  const { email, password, displayName } = req.body;
  try {
    const data = await authService.signupAdmin(email, password, { displayName });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const data = await authService.login(email, password);
    const idToken = data.idToken;
    // Verificar el token para obtener el uid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Obtener el registro del usuario para obtener los claims personalizados
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    const customClaims = userRecord.customClaims || {};
    const role = customClaims.role || null;
    const displayName = userRecord.displayName || email.split('@')[0];

    // Construir la respuesta con los datos necesarios
    res.status(200).json({
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      email: data.email,
      role: role,
      displayName: displayName,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(400).json({ error: 'Credenciales inválidas' });
  }
}

async function signout(req, res) {
  const idToken = req.headers.authorization?.split('Bearer ')[1]; // Extraemos el token del header
  if (!idToken) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const data = await authService.signout(idToken);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error al cerrar sesión' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const data = await authService.forgotPassword(email);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function signupMusician(req, res) {
  const { email, password, name, location } = req.body;
  try {
    const data = await authService.signupMusician(email, password, { name, location });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}

// Nueva función para obtener datos protegidos del usuario
async function getProtectedData(req, res) {
  try {
    const user = {
      email: req.user.email,
      role: req.user.role,
      displayName: req.user.displayName || req.user.email.split('@')[0],
    };
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error en getProtectedData:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  signupClient,
  signupAdmin,
  signupMusician,
  login,
  signout,
  forgotPassword,
  getProtectedData,
};
