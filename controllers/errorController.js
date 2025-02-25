const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or other unknown error: don't leak to client
    // console.log('Error 🎇', err);
    res.status(500).json({
      status: 'Error',
      message: 'Something Went wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate field error ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError(`Invalid token. Please login again`, 401);
};

const handleTokenExpiredError = () => {
  return new AppError(`Token expired already. Please login again`, 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    // console.log('ERROR', err);
    // console.log('ERROR Name', err.name);

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = Object.assign({}, err);
    let error = { ...err, name: err.name, message: err.message };
    // console.log('ERROR', error);
    // console.log('ERROR Name', error.name);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, res);
  }
};
