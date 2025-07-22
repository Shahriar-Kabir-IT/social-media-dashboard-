const Post = require('../models/Post');  // Direct path to Post model
const User = require('../models/User');  // Direct path to User model
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.createPost = asyncHandler(async (req, res, next) => {
  const { platform, content, scheduledTime } = req.body;
  const media = req.file;

  const post = await Post.create({
    user_id: req.user.id,
    platform,
    content,
    scheduled_time: scheduledTime,
    media_url: media ? `/uploads/${media.filename}` : null,
    media_type: media ? media.mimetype : null
  });

  res.status(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.getPendingPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.findAll({
    where: { status: 'pending' },
    include: [{ model: User, attributes: ['id', 'name', 'email'] }]
  });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

exports.getPostHistory = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;

  const posts = await Post.findAll({
    where,
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    order: [['created_at', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

exports.approvePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  post.status = 'approved';
  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.rejectPost = asyncHandler(async (req, res, next) => {
  const { rejectionReason } = req.body;
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    return next(new ErrorResponse('Post not found', 404));
  }

  post.status = 'rejected';
  post.rejection_reason = rejectionReason;
  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.getManagerPosts = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const where = { user_id: req.user.id };
  if (status && status !== 'all') where.status = status;

  const posts = await Post.findAll({
    where,
    order: [['created_at', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});