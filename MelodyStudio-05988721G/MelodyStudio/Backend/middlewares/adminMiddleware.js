// Backend/middlewares/adminMiddleware.js

const admin = require('../firebase/firebase').admin;

function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
  }
}

module.exports = authorizeAdmin;
