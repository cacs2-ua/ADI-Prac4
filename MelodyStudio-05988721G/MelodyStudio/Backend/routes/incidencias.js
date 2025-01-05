// Backend/routes/incidencias.js

const express = require('express');
const router = express.Router();
const incidenciaController = require('../controllers/incidenciaController');
const authenticateToken = require('../middlewares/authMiddleware'); // Asegurarse de que la autenticación es requerida

// Crear una nueva incidencia
router.post('/', authenticateToken, incidenciaController.createIncidencia);

// Obtener todas las incidencias con paginación basada en cursores
router.get('/', authenticateToken, incidenciaController.getAllIncidencias);

// Obtener una incidencia por ID
router.get('/:id', authenticateToken, incidenciaController.getIncidenciaById);

// Actualizar una incidencia por ID
router.put('/:id', authenticateToken, incidenciaController.updateIncidencia);

// Eliminar una incidencia por ID
router.delete('/:id', authenticateToken, incidenciaController.deleteIncidencia);

module.exports = router;
