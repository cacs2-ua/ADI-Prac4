// Backend/middlewares/authMiddleware.js

const admin = require('../firebase/firebase').admin; // Importar admin correctamente

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // Obtener el registro del usuario para obtener los claims personalizados
      const userRecord = await admin.auth().getUser(decodedToken.uid);
      const customClaims = userRecord.customClaims || {};
      req.user = {
        ...decodedToken,
        ...customClaims,
      };
      next();
    } catch (error) {
      console.error('Error verificando el token:', error);
      return res.status(401).json({ message: 'No autorizado' });
    }
  } else {
    res.status(401).json({ message: 'No autorizado' });
  }
}

module.exports = authenticateToken;
