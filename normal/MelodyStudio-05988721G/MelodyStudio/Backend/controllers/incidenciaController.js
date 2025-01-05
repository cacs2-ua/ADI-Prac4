//controller/incidenciaController.js

const incidenciaService = require('../services/incidenciaService');

/**
 * Crear una nueva Incidencia
 */
async function createIncidencia(req, res) {
  const { title, description } = req.body;
  const userId = req.user.uid;
  try {
    const incidencia = await incidenciaService.createIncidencia({ title, description, userId });
    res.status(201).json(incidencia);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error creando la incidencia' });
  }
}

/**
 * Obtener todas las Incidencias con paginación y búsqueda
 */
async function getAllIncidencias(req, res) {
  const userId = req.user.uid;
  const limit = parseInt(req.query.limit) || 3; 
  const pageToken = req.query.pageToken || null;
  const search = req.query.search || null;

  try {
    const { incidencias, totalPages, totalItems, hasNextPage, nextPageToken } = await incidenciaService.getAllIncidencias(userId, limit, pageToken, search);
    res.status(200).json({
      incidencias,
      totalPages,
      totalItems,
      currentPageToken: pageToken,
      hasNextPage,
      nextPageToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error obteniendo las incidencias' });
  }
}

/**
 * Obtener una Incidencia por ID
 */
async function getIncidenciaById(req, res) {
  const { id } = req.params;
  try {
    const incidencia = await incidenciaService.getIncidenciaById(id);
    res.status(200).json(incidencia);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message || 'Error obteniendo la incidencia' });
  }
}

/**
 * Actualizar una Incidencia por ID
 */
async function updateIncidencia(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const incidencia = await incidenciaService.getIncidenciaById(id);
    if (incidencia.userId !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updatedIncidencia = await incidenciaService.updateIncidencia(id, data);
    res.status(200).json(updatedIncidencia);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error actualizando la incidencia' });
  }
}

/**
 * Eliminar una Incidencia por ID
 */
async function deleteIncidencia(req, res) {
  const { id } = req.params;
  try {
    const incidencia = await incidenciaService.getIncidenciaById(id);
    if (incidencia.userId !== req.user.uid) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await incidenciaService.deleteIncidencia(id);
    res.status(200).json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Error eliminando la incidencia' });
  }
}

module.exports = {
  createIncidencia,
  getAllIncidencias,
  getIncidenciaById,
  updateIncidencia,
  deleteIncidencia,
};
