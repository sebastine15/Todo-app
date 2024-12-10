const logger = require('../utils/logger'); // Import logger utility

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500; // Default to Internal Server Error
  const message = err.message || 'Internal Server Error';

  // Log the error using the logger utility
  logger('error', `${req.method} ${req.url} - ${message}`);

  // Respond to the client with a JSON error object
  res.status(statusCode).json({
    error: {
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
  });
};

module.exports = errorHandler;
