// services/incidenciaService.js

const { db } = require('../firebase/firebase');

/**
 * Transformar un objeto de incidencia para convertir Timestamp a string
 */
function transformIncidencia(incidencia) {
  return {
    ...incidencia,
    createdAt: incidencia.createdAt.toDate().toISOString(),
  };
}

/**
 * Crear una nueva Incidencia
 */
async function createIncidencia(data) {
  try {
    const incidenciaRef = await db.collection('incidencias').add({
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      userId: data.userId,
    });
    const incidencia = await incidenciaRef.get();
    const incidenciaData = { id: incidenciaRef.id, ...incidencia.data() };
    return transformIncidencia(incidenciaData);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener todas las Incidencias con paginación y búsqueda.
 */
async function getAllIncidencias(userId, limit = 3, pageToken = null, search = null) {
  try {
    let query = db.collection('incidencias')
      .where('userId', '==', userId);

    let orderByFields = [];
    let cursorValues = [];

    // Si hay un término de búsqueda, filtramos por título usando rangos (para búsqueda parcial)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      // Ordenar por 'title' y luego por 'createdAt' para manejar duplicados en 'title'
      query = query.orderBy('title').orderBy('createdAt').startAt(searchTerm).endAt(searchTerm + '\uf8ff');
      orderByFields = ['title', 'createdAt'];
    } else {
      // Sin búsqueda, ordenamos por fecha de creación
      query = query.orderBy('createdAt', 'desc');
      orderByFields = ['createdAt'];
    }

    query = query.limit(limit + 1);

    if (pageToken) {
      if (search && search.trim() !== '') {
        // Parsear el pageToken como JSON
        const token = JSON.parse(pageToken);
        if (token.title && token.createdAt) {
          query = query.startAfter(token.title, token.createdAt);
        }
      } else {
        // Parsear el pageToken como fecha ISO
        const lastCreatedAt = new Date(pageToken);
        if (!isNaN(lastCreatedAt)) {
          query = query.startAfter(lastCreatedAt);
        }
      }
    }

    const snapshot = await query.get();

    const incidencias = [];
    snapshot.forEach((doc) => {
      const incidenciaData = { id: doc.id, ...doc.data() };
      incidencias.push(transformIncidencia(incidenciaData));
    });

    let hasNextPage = false;
    let nextPageToken = null;

    if (incidencias.length > limit) {
      hasNextPage = true;
      const lastItem = incidencias[limit - 1];
      nextPageToken = search
        ? JSON.stringify({ title: lastItem.title, createdAt: lastItem.createdAt })
        : lastItem.createdAt;
      incidencias.splice(limit); // Eliminar la incidencia extra utilizada para determinar la siguiente página
    }

    // Calcular totalItems con la misma condición de búsqueda
    let totalQuery = db.collection('incidencias').where('userId', '==', userId);
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      totalQuery = totalQuery.orderBy('title').orderBy('createdAt').startAt(searchTerm).endAt(searchTerm + '\uf8ff');
    } else {
      totalQuery = totalQuery.orderBy('createdAt', 'desc');
    }
    const totalItemsSnapshot = await totalQuery.get();
    const totalItems = totalItemsSnapshot.size;
    const totalPages = Math.ceil(totalItems / limit);

    return { incidencias, totalPages, totalItems, hasNextPage, nextPageToken };
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener Incidencia por ID
 */
async function getIncidenciaById(id) {
  try {
    const doc = await db.collection('incidencias').doc(id).get();
    if (!doc.exists) {
      throw { message: 'Incidencia no encontrada', status: 404 };
    }
    const incidenciaData = { id: doc.id, ...doc.data() };
    return transformIncidencia(incidenciaData);
  } catch (error) {
    throw error;
  }
}

/**
 * Actualizar Incidencia por ID
 */
async function updateIncidencia(id, data) {
  try {
    const incidenciaRef = db.collection('incidencias').doc(id);
    await incidenciaRef.update(data);
    const updatedIncidencia = await incidenciaRef.get();
    const updatedData = { id: updatedIncidencia.id, ...updatedIncidencia.data() };
    return transformIncidencia(updatedData);
  } catch (error) {
    throw error;
  }
}

/**
 * Eliminar Incidencia por ID
 */
async function deleteIncidencia(id) {
  try {
    await db.collection('incidencias').doc(id).delete();
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createIncidencia,
  getAllIncidencias,
  getIncidenciaById,
  updateIncidencia,
  deleteIncidencia,
};
