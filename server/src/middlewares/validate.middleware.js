// src/middlewares/validate.middleware.js
// Reads express-validator results and short-circuits with 422 if invalid.
'use strict';

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Must be placed AFTER express-validator rule chains in the route definition.
 * Returns a structured 422 response listing all field errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      'Validation failed',
      422,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  return next();
}

module.exports = { handleValidationErrors };
