const ErrorResponse = require('../utils/errorResponse');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorResponse(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errors[0].message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorResponse(message, 400);
};

const handleJWTError = () =>
  new ErrorResponse('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new ErrorResponse('Your token has expired! Please log in again.', 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'SequelizeValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  res.status(error.statusCode || 500).json({
    status: error.status,
    message: error.message || 'Something went wrong!'
  });
};

module.exports = errorHandler;