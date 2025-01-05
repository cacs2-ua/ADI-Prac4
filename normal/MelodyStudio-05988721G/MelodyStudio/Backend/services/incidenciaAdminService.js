// Backend/services/incidenciaAdminService.js

const { db } = require('../firebase/firebase');

/**
 * Obtener nombre de usuario por userId
 */
async function getUserName(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.displayName || userData.email;
    } else {
      return 'Usuario Desconocido';
    }
  } catch (error) {
    console.error('Error obteniendo nombre de usuario:', error);
    return 'Usuario Desconocido';
  }
}

/**
 * Transformar un objeto de incidencia para convertir Timestamp a string y agregar nombre de usuario
 */
async function transformIncidenciaAdmin(incidencia) {
  const userName = await getUserName(incidencia.userId);
  return {
    ...incidencia,
    createdAt: incidencia.createdAt.toDate().toISOString(),
    userName,
  };
}

/**
 * Listar todas las incidencias con paginación y búsqueda
 */
async function listAllIncidencias(limit = 5, pageToken = null, search = null) {
  try {
    let query = db.collection('incidencias');

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      query = query.where('title', '>=', searchTerm)
                   .where('title', '<=', searchTerm + '\uf8ff');
    }

    query = query.orderBy('createdAt', 'desc').limit(limit + 1);

    if (pageToken) {
      const lastVisible = db.collection('incidencias').doc(pageToken);
      const lastDoc = await lastVisible.get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const incidencias = [];
    snapshot.forEach((doc) => {
      const incidenciaData = { id: doc.id, ...doc.data() };
      incidencias.push(incidenciaData);
    });

    let hasNextPage = false;
    let nextPageToken = null;

    if (incidencias.length > limit) {
      hasNextPage = true;
      const lastItem = incidencias[limit - 1];
      nextPageToken = lastItem.id;
      incidencias.splice(limit);
    }

    // Transformar incidencias para agregar nombre de usuario
    const incidenciasConNombres = await Promise.all(incidencias.map(transformIncidenciaAdmin));

    return { incidencias: incidenciasConNombres, hasNextPage, nextPageToken };
  } catch (error) {
    throw error;
  }
}

/**
 * Eliminar una incidencia por ID
 */
async function deleteAnyIncidencia(id) {
  try {
    await db.collection('incidencias').doc(id).delete();
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listAllIncidencias,
  deleteAnyIncidencia,
};
