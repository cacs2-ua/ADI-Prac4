// Backend/controllers/incidenciaAdminController.js

const incidenciaAdminService = require('../services/incidenciaAdminService');

/**
 * Listar todas las incidencias para administrador
 */
async function listAllIncidencias(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const pageToken = req.query.pageToken || null;
  const search = req.query.search || null;

  try {
    const { incidencias, hasNextPage, nextPageToken } = await incidenciaAdminService.listAllIncidencias(limit, pageToken, search);
    res.status(200).json({
      incidencias,
      hasNextPage,
      nextPageToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error obteniendo las incidencias' });
  }
}

/**
 * Eliminar cualquier incidencia por ID (Administrador)
 */
async function deleteAnyIncidencia(req, res) {
  const id = req.params.id;
  try {
    await incidenciaAdminService.deleteAnyIncidencia(id);
    res.status(200).json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error eliminando la incidencia' });
  }
}

module.exports = {
  listAllIncidencias,
  deleteAnyIncidencia,
};
