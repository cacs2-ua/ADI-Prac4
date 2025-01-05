// Backend/routes/appointments.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/authMiddleware');

// Crear una nueva cita
router.post('/', authenticateToken, appointmentController.createAppointment);

// Obtener detalles de una cita
router.get('/:id', authenticateToken, appointmentController.getAppointment);

// Actualizar una cita
router.put('/:id', authenticateToken, appointmentController.updateAppointment);

// Eliminar una cita
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

// Listar citas del usuario con paginación basada en cursores
router.get('/', authenticateToken, appointmentController.listUserAppointments);

module.exports = router;
