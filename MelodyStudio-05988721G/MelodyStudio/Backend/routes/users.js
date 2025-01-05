// routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.put('/me', authenticateToken, userController.editProfile);
router.delete('/me', authenticateToken, userController.deleteAccount);

module.exports = router;
