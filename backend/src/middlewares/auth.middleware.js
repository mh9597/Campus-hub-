// src/middlewares/auth.middleware.js
// Verifies the JWT access token in the Authorization header.
// Usage:
//   router.get('/protected', authenticate, requireRole('ADMIN'), handler)
'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');

/**
 * Middleware: verify Bearer JWT access token.
 * Attaches decoded payload as `req.user` = { id, email, role }.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Missing or malformed Authorization header', 401);
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Access token expired', 401);
    }
    return sendError(res, 'Invalid access token', 401);
  }
}

/**
 * Middleware factory: only allow certain roles through.
 * @param {...string} roles  e.g. requireRole('ADMIN', 'MODERATOR')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Forbidden: requires one of [${roles.join(', ')}]`,
        403
      );
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
