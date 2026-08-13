// src/routes/admin.routes.js
// Protected admin management routes — ALL require authenticate middleware.
// Mounted at /api/admin
'use strict';

const { Router } = require('express');
const { body, param, query } = require('express-validator');

const adminController = require('../controllers/admin.controller');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const { adminUpload } = require('../config/multer');

const router = Router();

// Apply authentication to every route in this router
router.use(authenticate);

// ─── Uploads ──────────────────────────────────────────────────

// GET /api/admin/uploads?status=PENDING
router.get(
  '/uploads',
  [query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])],
  handleValidationErrors,
  adminController.getUploads
);

// PATCH /api/admin/uploads/:id
router.patch(
  '/uploads/:id',
  [
    param('id').isUUID(),
    body('action').notEmpty().isIn(['APPROVED', 'REJECTED']),
  ],
  handleValidationErrors,
  adminController.reviewUpload
);

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING
router.get(
  '/requests',
  [query('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED'])],
  handleValidationErrors,
  adminController.getRequests
);

// PATCH /api/admin/requests/:id
router.patch(
  '/requests/:id',
  [
    param('id').isUUID(),
    body('action').notEmpty().isIn(['APPROVED', 'REJECTED']),
  ],
  handleValidationErrors,
  adminController.reviewRequest
);

// ─── Resources ────────────────────────────────────────────────

// GET /api/admin/resources
router.get(
  '/resources',
  [
    query('subjectCode').optional().isString().trim(),
    query('search').optional().isString().trim(),
  ],
  handleValidationErrors,
  adminController.getResources
);

// POST /api/admin/resources
router.post(
  '/resources',
  requireRole('ADMIN', 'MODERATOR'),
  adminUpload.single('file'),
  [
    body('subjectId').notEmpty().isUUID(),
    body('title').notEmpty().isString().trim(),
    body('resourceType').notEmpty().isString().trim(),
    body('fileUrl').optional().isURL(),
  ],
  handleValidationErrors,
  adminController.createResource
);

// PUT /api/admin/resources/:id
router.put(
  '/resources/:id',
  requireRole('ADMIN', 'MODERATOR'),
  [
    param('id').isUUID(),
    body('title').optional().isString().trim(),
    body('resourceType').optional().isString().trim(),
    body('isActive').optional().isBoolean(),
  ],
  handleValidationErrors,
  adminController.updateResource
);

// DELETE /api/admin/resources/:id  (soft-delete)
router.delete(
  '/resources/:id',
  requireRole('ADMIN'),
  [param('id').isUUID()],
  handleValidationErrors,
  adminController.deleteResource
);

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
router.get('/opportunities', adminController.getOpportunities);

// POST /api/admin/opportunities
router.post(
  '/opportunities',
  requireRole('ADMIN', 'MODERATOR'),
  [body('title').notEmpty().isString().trim()],
  handleValidationErrors,
  adminController.createOpportunity
);

// PATCH /api/admin/opportunities/:id/toggle
router.patch('/opportunities/:id/toggle', requireRole('ADMIN', 'MODERATOR'), adminController.toggleOpportunity);

// DELETE /api/admin/opportunities/:id
router.delete('/opportunities/:id', requireRole('ADMIN'), adminController.deleteOpportunity);

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
router.get('/announcements', adminController.getAnnouncements);

// POST /api/admin/announcements
router.post(
  '/announcements',
  requireRole('ADMIN', 'MODERATOR'),
  [body('text').notEmpty().isString().trim()],
  handleValidationErrors,
  adminController.createAnnouncement
);

// PATCH /api/admin/announcements/:id/toggle
router.patch('/announcements/:id/toggle', requireRole('ADMIN', 'MODERATOR'), adminController.toggleAnnouncement);

// DELETE /api/admin/announcements/:id
router.delete('/announcements/:id', requireRole('ADMIN'), adminController.deleteAnnouncement);

// ─── Academic Catalog (Departments / Semesters / Subjects) ────
router.use('/catalog', require('./catalog.routes'));

module.exports = router;
