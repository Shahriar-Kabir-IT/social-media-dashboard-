const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');  // Make sure this path is correct

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/check', protect, authController.checkAuth);

module.exports = router;