// Backend/routes/admin/appointments.js

const express = require('express');
const router = express.Router();
const appointmentAdminController = require('../../controllers/appointmentAdminController');
const authenticateToken = require('../../middlewares/authMiddleware');
const authorizeAdmin = require('../../middlewares/adminMiddleware');

// Middleware para autenticar y autorizar como administrador
router.use(authenticateToken);
router.use(authorizeAdmin);

// Listar todas las citas
router.get('/', appointmentAdminController.listAllAppointments);

// Eliminar una cita por ID
router.delete('/:id', appointmentAdminController.deleteAnyAppointment);

module.exports = router;
