// services/appointmentService.js

const { db } = require('../firebase/firebase');

/**
 * Transformar un objeto de cita para convertir Timestamp a string
 */
function transformAppointment(appointment) {
  return {
    ...appointment,
    createdAt: appointment.createdAt.toDate().toISOString(),
  };
}

/**
 * Crear una nueva cita
 */
async function createAppointment(data) {
  try {
    const appointmentRef = await db.collection('appointments').add({
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      createdAt: new Date(),
      userId: data.userId,
    });
    const appointment = await appointmentRef.get();
    const appointmentData = { id: appointmentRef.id, ...appointment.data() };
    return transformAppointment(appointmentData);
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener una cita por ID
 */
async function getAppointment(id) {
  try {
    const doc = await db.collection('appointments').doc(id).get();
    if (!doc.exists) {
      throw { message: 'Cita no encontrada', status: 404 };
    }
    const appointmentData = { id: doc.id, ...doc.data() };
    return transformAppointment(appointmentData);
  } catch (error) {
    throw error;
  }
}

/**
 * Actualizar una cita
 */
async function updateAppointment(id, data) {
  try {
    const appointmentRef = db.collection('appointments').doc(id);
    await appointmentRef.update(data);
    const updatedAppointment = await appointmentRef.get();
    const updatedData = { id: updatedAppointment.id, ...updatedAppointment.data() };
    return transformAppointment(updatedData);
  } catch (error) {
    throw error;
  }
}

/**
 * Eliminar una cita
 */
async function deleteAppointment(id) {
  try {
    await db.collection('appointments').doc(id).delete();
    return;
  } catch (error) {
    throw error;
  }
}

/**
 * Listar citas del usuario con paginación y búsqueda.
 */
async function listUserAppointments(userId, limit = 3, pageToken = null, search = null) {
  try {
    let query = db.collection('appointments')
      .where('userId', '==', userId);

    let orderByFields = [];
    let cursorValues = [];

    // Si hay un término de búsqueda, filtramos por título usando rangos (para búsqueda parcial)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      // Cambiamos el orderBy a 'title' y luego a 'createdAt' para manejar duplicados en 'title'
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

    const citas = [];
    snapshot.forEach((doc) => {
      const citaData = { id: doc.id, ...doc.data() };
      citas.push(transformAppointment(citaData));
    });

    let hasNextPage = false;
    let nextPageToken = null;

    if (citas.length > limit) {
      hasNextPage = true;
      const lastItem = citas[limit - 1];
      nextPageToken = search
        ? JSON.stringify({ title: lastItem.title, createdAt: lastItem.createdAt })
        : lastItem.createdAt;
      citas.splice(limit); // Eliminar la cita extra utilizada para determinar la siguiente página
    }

    // Calcular totalItems con la misma condición de búsqueda
    let totalQuery = db.collection('appointments').where('userId', '==', userId);
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      totalQuery = totalQuery.orderBy('title').orderBy('createdAt').startAt(searchTerm).endAt(searchTerm + '\uf8ff');
    } else {
      totalQuery = totalQuery.orderBy('createdAt', 'desc');
    }
    const totalItemsSnapshot = await totalQuery.get();
    const totalItems = totalItemsSnapshot.size;
    const totalPages = Math.ceil(totalItems / limit);

    return { citas, totalPages, totalItems, hasNextPage, nextPageToken };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  listUserAppointments,
};
