// Backend/services/appointmentAdminService.js

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
 * Transformar un objeto de cita para convertir Timestamp a string y agregar nombre de usuario
 */
async function transformAppointmentAdmin(appointment) {
  const userName = await getUserName(appointment.userId);
  return {
    ...appointment,
    createdAt: appointment.createdAt.toDate().toISOString(),
    userName,
  };
}

/**
 * Listar todas las citas con paginación y búsqueda
 */
async function listAllAppointments(limit = 5, pageToken = null, search = null) {
  try {
    let query = db.collection('appointments');

    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      query = query.where('title', '>=', searchTerm)
                   .where('title', '<=', searchTerm + '\uf8ff');
    }

    query = query.orderBy('createdAt', 'desc').limit(limit + 1);

    if (pageToken) {
      const lastVisible = db.collection('appointments').doc(pageToken);
      const lastDoc = await lastVisible.get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();

    const citas = [];
    snapshot.forEach((doc) => {
      const citaData = { id: doc.id, ...doc.data() };
      citas.push(citaData);
    });

    let hasNextPage = false;
    let nextPageToken = null;

    if (citas.length > limit) {
      hasNextPage = true;
      const lastItem = citas[limit - 1];
      nextPageToken = lastItem.id;
      citas.splice(limit);
    }

    // Transformar citas para agregar nombre de usuario
    const citasConNombres = await Promise.all(citas.map(transformAppointmentAdmin));

    return { citas: citasConNombres, hasNextPage, nextPageToken };
  } catch (error) {
    throw error;
  }
}

/**
 * Eliminar una cita por ID
 */
async function deleteAnyAppointment(id) {
  try {
    await db.collection('appointments').doc(id).delete();
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listAllAppointments,
  deleteAnyAppointment,
};
