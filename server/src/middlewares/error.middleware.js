// src/middlewares/error.middleware.js
// Global Express error handler — must be registered LAST in app.js.
'use strict';

const multer = require('multer');

/**
 * Catches errors forwarded via next(err).
 * Strips stack traces in production.
 */
function errorHandler(err, req, res, _next) {
  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File is too large. Maximum size is 50 MB.',
      LIMIT_UNEXPECTED_FILE: err.message || 'Unexpected file field.',
      LIMIT_FILE_COUNT: 'Too many files uploaded.',
    };
    return res.status(400).json({
      success: false,
      message: messages[err.code] || 'File upload error.',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ERROR ${statusCode}:`, err);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

/**
 * 404 handler — place BEFORE errorHandler.
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { errorHandler, notFoundHandler };
