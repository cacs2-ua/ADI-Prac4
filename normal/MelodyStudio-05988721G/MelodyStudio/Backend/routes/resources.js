// routes/musicians.js

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authenticateToken = require('../middlewares/authMiddleware');
const reviewRoutes = require('./reviews');

router.get('/', resourceController.listResources);
router.get('/:id', resourceController.getResourceDetails);
router.put('/:id', authenticateToken, resourceController.updateResource);
router.delete('/:id', authenticateToken, resourceController.deleteResource);
router.get('/paginated', resourceController.listResourcesPaginated);
router.use('/:musicianId/reviews', reviewRoutes);

module.exports = router;
