const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ where: { email, role } });

  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user.id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new ErrorResponse('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};