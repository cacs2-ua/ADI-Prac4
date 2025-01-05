// Backend/controllers/appointmentAdminController.js

const appointmentAdminService = require('../services/appointmentAdminService');

/**
 * Listar todas las citas para administrador
 */
async function listAllAppointments(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const pageToken = req.query.pageToken || null;
  const search = req.query.search || null;

  try {
    const { citas, hasNextPage, nextPageToken } = await appointmentAdminService.listAllAppointments(limit, pageToken, search);
    res.status(200).json({
      citas,
      hasNextPage,
      nextPageToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error obteniendo las citas' });
  }
}

/**
 * Eliminar cualquier cita por ID (Administrador)
 */
async function deleteAnyAppointment(req, res) {
  const id = req.params.id;
  try {
    await appointmentAdminService.deleteAnyAppointment(id);
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error eliminando la cita' });
  }
}

module.exports = {
  listAllAppointments,
  deleteAnyAppointment,
};
