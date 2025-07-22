const express = require('express');
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;