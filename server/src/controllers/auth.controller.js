// src/controllers/auth.controller.js
// Admin authentication — login, refresh, logout, me.
'use strict';

const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

const COOKIE_NAME = 'srh_refresh_token';

// POST /api/admin/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, cookieOptions, user } =
      await authService.login(email, password);

    res.cookie(COOKIE_NAME, refreshToken, cookieOptions);

    return sendSuccess(
      res,
      { accessToken, user },
      200,
      'Login successful'
    );
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/auth/refresh
async function refresh(req, res, next) {
  try {
    const cookieToken = req.cookies?.[COOKIE_NAME];

    const { accessToken, newRefreshToken, cookieOptions } =
      await authService.refresh(cookieToken);

    res.cookie(COOKIE_NAME, newRefreshToken, cookieOptions);

    return sendSuccess(res, { accessToken }, 200, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/auth/logout
async function logout(req, res, next) {
  try {
    // req.user may be undefined if called without token — still clear the cookie
    if (req.user?.id) {
      await authService.logout(req.user.id);
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: '/api/admin/auth',
    });

    return sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (err) {
    return next(err);
  }
}

// GET /api/admin/auth/me  (requires authenticate middleware)
async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, user);
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, refresh, logout, me };
