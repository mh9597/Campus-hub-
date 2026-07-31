// src/utils/response.js — Consistent JSON response helpers
'use strict';

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 * @param {string} [message]
 */
function sendSuccess(res, data = null, statusCode = 200, message = 'OK') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {*} [errors=null]
 */
function sendError(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

module.exports = { sendSuccess, sendError };
