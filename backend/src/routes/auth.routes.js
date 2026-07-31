// src/routes/auth.routes.js
// Admin authentication routes — mounted at /api/admin/auth
'use strict';

const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');

const router = Router();

// POST /api/admin/auth/login
router.post(
  '/login',
  [
    body('email')
      .notEmpty().withMessage('email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidationErrors,
  authController.login
);

// POST /api/admin/auth/refresh  — no auth required (uses HttpOnly cookie)
router.post('/refresh', authController.refresh);

// POST /api/admin/auth/logout  — optionally authenticated
router.post('/logout', authenticate, authController.logout);

// GET /api/admin/auth/me  — requires valid access token
router.get('/me', authenticate, authController.me);

module.exports = router;
