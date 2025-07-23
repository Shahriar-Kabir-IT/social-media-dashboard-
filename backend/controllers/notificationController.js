
const { Notification, User } = require('../models');
const asyncHandler = require('../middlewares/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.id },
    order: [['created_at', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: {
      notifications
    }
  });
});

exports.markAsRead = asyncHandler(async (req, res, next) => {
  await Notification.update(
    { is_read: true },
    { where: { id: req.params.id, user_id: req.user.id } }
  );

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read'
  });
});

exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.update(
    { is_read: true },
    { where: { user_id: req.user.id, is_read: false } }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read'
  });
});
