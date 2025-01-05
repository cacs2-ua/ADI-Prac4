//controller/appointmentController.js

const appointmentService = require('../services/appointmentService');

/**
 * Crear una nueva cita
 */
async function createAppointment(req, res) {
  const data = req.body;
  data.userId = req.user.uid; // Asignar el ID del usuario autenticado
  try {
    const appointment = await appointmentService.createAppointment(data);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error creando la cita' });
  }
}

/**
 * Obtener detalles de una cita
 */
async function getAppointment(req, res) {
  const id = req.params.id;
  try {
    const appointment = await appointmentService.getAppointment(id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || 'Error obteniendo la cita' });
  }
}

/**
 * Actualizar una cita
 */
async function updateAppointment(req, res) {
  const id = req.params.id;
  const data = req.body;
  try {
    // Verificar que la cita pertenece al usuario
    const appointment = await appointmentService.getAppointment(id);
    if (appointment.userId !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    const updatedAppointment = await appointmentService.updateAppointment(id, data);
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || 'Error actualizando la cita' });
  }
}

/**
 * Eliminar una cita
 */
async function deleteAppointment(req, res) {
  const id = req.params.id;
  try {
    // Verificar que la cita pertenece al usuario
    const appointment = await appointmentService.getAppointment(id);
    if (appointment.userId !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    await appointmentService.deleteAppointment(id);
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || 'Error eliminando la cita' });
  }
}

/**
 * Listar citas del usuario con paginación y búsqueda
 */
async function listUserAppointments(req, res) {
  const userId = req.user.uid;
  const limit = parseInt(req.query.limit) || 3; // Número de citas por página
  const pageToken = req.query.pageToken || null; // Token de la página anterior
  const search = req.query.search || null; // Término de búsqueda

  try {
    const { citas, totalPages, totalItems, hasNextPage, nextPageToken } = await appointmentService.listUserAppointments(userId, limit, pageToken, search);
    res.status(200).json({
      citas,
      totalPages,
      totalItems,
      hasNextPage,
      nextPageToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error obteniendo las citas' });
  }
}

module.exports = {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  listUserAppointments,
};
