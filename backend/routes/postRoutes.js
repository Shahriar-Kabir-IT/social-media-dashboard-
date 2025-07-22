const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../utils/multer');

// Protect all routes
router.use(authMiddleware.protect);

// CEO routes
router.get('/pending', authMiddleware.restrictTo('ceo'), postController.getPendingPosts);
router.get('/history', authMiddleware.restrictTo('ceo'), postController.getPostHistory);
router.put('/:id/approve', authMiddleware.restrictTo('ceo'), postController.approvePost);
router.put('/:id/reject', authMiddleware.restrictTo('ceo'), postController.rejectPost);

// Manager routes
router.post('/', authMiddleware.restrictTo('manager'), upload.single('media'), postController.createPost);
router.get('/manager', authMiddleware.restrictTo('manager'), postController.getManagerPosts);

module.exports = router;