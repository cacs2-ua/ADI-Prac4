// services/musicianService.js

const db = require('../firebase/firebase').db;

async function listResources() {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'musician').get();
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });
    return resources;
  } catch (error) {
    throw error;
  }
}

async function getResourceDetails(id) {
  try {
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists || doc.data().role !== 'musician') {
      throw { message: 'Centro médico no encontrado' };
    }
    const data = doc.data();
    // Obtener subrecursos asociados
    const servicesSnapshot = await db.collection('musician').doc(id).collection('services').get();
    const services = [];
    servicesSnapshot.forEach(serviceDoc => {
      services.push({ id: serviceDoc.id, ...serviceDoc.data() });
    });
    data.services = services;

    const reviewsSnapshot = await db.collection('musician-reviews').doc(id).collection('reviews').get();
    const reviews = [];
    let totalRating = 0;
    reviewsSnapshot.forEach(reviewDoc => {
      const reviewData = reviewDoc.data();
      reviews.push({ id: reviewDoc.id, ...reviewData });
      totalRating += reviewData.rating;
    });
    data.reviews = reviews;
    data.averageRating = reviews.length ? totalRating / reviews.length : null;
    
    return { id: doc.id, ...data };
  } catch (error) {
    throw error;
  }
}

async function updateResource(id, data) {
  try {
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().role !== 'musician') {
      throw { message: 'Centro médico no encontrado' };
    }
    await docRef.update(data);
    return;
  } catch (error) {
    throw error;
  }
}

async function deleteResource(id) {
  try {
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    if (!doc.exists || doc.data().role !== 'musician') {
      throw { message: 'Centro médico no encontrado' };
    }
    await docRef.delete();

    // Eliminar el usuario de Firebase Authentication
    const admin = require('../firebase/firebase').admin;
    await admin.auth().deleteUser(id);

    return;
  } catch (error) {
    throw error;
  }
}

async function listResourcesPaginated(limit, startAfter) {
  try {
    let query = db.collection('users')
                  .where('role', '==', 'musician')
                  .orderBy('name')
                  .limit(limit);
    
    if (startAfter) {
      const lastDoc = await db.collection('users').doc(startAfter).get();
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const resources = [];
    snapshot.forEach(doc => {
      resources.push({ id: doc.id, ...doc.data() });
    });

    return resources;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  listResources,
  getResourceDetails,
  updateResource,
  deleteResource,
  listResourcesPaginated,
};

