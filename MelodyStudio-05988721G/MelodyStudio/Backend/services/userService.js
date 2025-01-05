// services/userService.js

const admin = require('../firebase/firebase').admin;
const { db } = require('../firebase/firebase'); // Importamos Firestore

async function updateUser(uid, data) {
  try {
    // Actualizar usuario en Firebase Authentication
    const userRecord = await admin.auth().updateUser(uid, data);

    // Actualizar usuario en Firestore
    const userRef = db.collection('users').doc(uid);
    const updateData = {};
    if (data.email) updateData.email = data.email;
    if (data.displayName) updateData.displayName = data.displayName;
    if (data.photoURL) updateData.photoURL = data.photoURL;

    if (Object.keys(updateData).length > 0) {
      await userRef.update(updateData);
    }

    return userRecord;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(uid) {
  try {
    // Eliminar usuario de Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Eliminar usuario de Firestore
    await db.collection('users').doc(uid).delete();

    return;
  } catch (error) {
    throw error;
  }
}

async function setUserRole(uid, role) {
  try {
    // Asignar rol en Firebase Authentication
    await admin.auth().setCustomUserClaims(uid, { role });

    // Actualizar rol en Firestore
    await db.collection('users').doc(uid).update({ role });

    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  updateUser,
  deleteUser,
  setUserRole,
};
