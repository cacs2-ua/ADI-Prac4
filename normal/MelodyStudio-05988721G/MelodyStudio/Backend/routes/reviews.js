// routes/reviews.js

const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middlewares/authMiddleware');

// Crear una reseña
router.post('/', authenticateToken, reviewController.createReview);

// Obtener reseñas de un centro
router.get('/', reviewController.getReviews);

module.exports = router;

