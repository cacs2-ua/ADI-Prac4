// services/authService.js

const axios = require('axios');
const { db, auth } = require('../firebase/firebase'); // Importamos Firestore
const { signOut } = require('firebase/auth');

const admin = require('../firebase/firebase').admin;

const API_KEY = 'AIzaSyBPk3N8ykNyDXUmWyaptvrsSChf2VWItwE'; // Reemplaza con tu clave de API de Firebase

async function signupClient(email, password, data = {}) {
  try {
    // Crear usuario en Firebase Authentication
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    const userData = response.data;

    // Asignar rol 'client' en Authentication
    await db.collection('users').doc(userData.localId).set({
      email: email,
      ...data,
      role: 'client',
      createdAt: new Date(),
    });

    // Asignar custom claims en Firebase Authentication
    await admin.auth().setCustomUserClaims(userData.localId, { role: 'client' });

    return userData;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

async function signupAdmin(email, password, data = {}) {
  try {
    // Crear usuario en Firebase Authentication
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    const userData = response.data;

    // Asignar rol 'admin' en Authentication
    await db.collection('users').doc(userData.localId).set({
      email: email,
      ...data,
      role: 'admin',
      createdAt: new Date(),
    });

    // Asignar custom claims en Firebase Authentication
    await admin.auth().setCustomUserClaims(userData.localId, { role: 'admin' });

    return userData;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

async function login(email, password) {
  try {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

async function signout(idToken) {
  try {
    // Verificamos el token para obtener el UID del usuario
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Revocamos los tokens de actualización del usuario, lo que también invalidará los tokens de sesión
    await admin.auth().revokeRefreshTokens(uid);
    return { message: 'Sesión cerrada correctamente' };
  } catch (error) {
    throw error;
  }
}



async function forgotPassword(email) {
  try {
    await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`, {
      requestType: 'PASSWORD_RESET',
      email,
    });
    return { message: 'Correo de restablecimiento enviado' };
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

async function signupMusician(email, password, data) {
  try {
    // Crear usuario en Firebase Authentication
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    const userData = response.data;

    // Asignar rol 'musician' en Authentication
    await db.collection('users').doc(userData.localId).set({
      email: email,
      ...data,
      role: 'musician',
      createdAt: new Date(),
    });

    // Asignar custom claims en Firebase Authentication
    await admin.auth().setCustomUserClaims(userData.localId, { role: 'musician' });

    return userData;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}


module.exports = {
  signupClient,
  signupAdmin,
  login,
  signout,
  forgotPassword,
  signupMusician,
};
