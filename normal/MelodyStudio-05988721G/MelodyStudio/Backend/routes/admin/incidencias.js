// Backend/routes/admin/incidencias.js

const express = require('express');
const router = express.Router();
const incidenciaAdminController = require('../../controllers/incidenciaAdminController');
const authenticateToken = require('../../middlewares/authMiddleware');
const authorizeAdmin = require('../../middlewares/adminMiddleware');

// Middleware para autenticar y autorizar como administrador
router.use(authenticateToken);
router.use(authorizeAdmin);

// Listar todas las incidencias
router.get('/', incidenciaAdminController.listAllIncidencias);

// Eliminar una incidencia por ID
router.delete('/:id', incidenciaAdminController.deleteAnyIncidencia);

module.exports = router;
