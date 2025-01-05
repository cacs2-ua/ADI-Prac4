// services/reviewService.js

const db = require('../firebase/firebase').db;

/**
 * Crear una nueva reseña
 */
async function createReview(musicianId, data) {
  try {
    const reviewRef = await db.collection('musician-reviews').doc(musicianId).collection('reviews').add(data);
    return { id: reviewRef.id, ...data };
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener reseñas de un centro
 */
async function getReviews(musicianId) {
  try {
    const snapshot = await db.collection('musician-reviews').doc(musicianId).collection('reviews').get();
    const reviews = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createReview,
  getReviews,
};
