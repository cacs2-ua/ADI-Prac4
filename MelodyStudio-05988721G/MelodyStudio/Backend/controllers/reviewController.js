// controllers/reviewController.js

const reviewService = require('../services/reviewService');

async function createReview(req, res) {
  const musicianId = req.params.musicianId;
  const data = req.body;
  data.userId = req.user.uid;
  data.createdAt = new Date();
  try {
    const review = await reviewService.createReview(musicianId, data);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function getReviews(req, res) {
  const musicianId = req.params.musicianId;
  try {
    const reviews = await reviewService.getReviews(musicianId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  createReview,
  getReviews,
};
