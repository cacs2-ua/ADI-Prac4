// controllers/userController.js

const userService = require('../services/userService');
const { db } = require('../firebase/firebase');

async function editProfile(req, res) {
  const uid = req.user.uid;
  const data = req.body;
  try {
    const userRecord = await userService.updateUser(uid, data);

    // Obtener datos actualizados del usuario desde Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    res.status(200).json({ userRecord, userData });
  } catch (error) {
    res.status(400).json(error);
  }
}

async function deleteAccount(req, res) {
  const uid = req.user.uid;
  try {
    await userService.deleteUser(uid);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  editProfile,
  deleteAccount,
};
