// src/routes/catalog.routes.js
// Academic Catalog management routes — mounted at /api/admin/catalog
// authenticate middleware is already applied by admin.routes.js
'use strict';

const { Router } = require('express');
const { requireRole } = require('../middlewares/auth.middleware');
const catalogController = require('../controllers/catalog.controller');

const router = Router();

// ─── Departments (Branches) ───────────────────────────────────

// GET  /api/admin/catalog/departments    — any authenticated admin/moderator
router.get('/departments', catalogController.getDepartments);

// POST /api/admin/catalog/departments    — ADMIN or MODERATOR
router.post('/departments', requireRole('ADMIN', 'MODERATOR'), catalogController.createDepartment);

// PUT  /api/admin/catalog/departments/:id
router.put('/departments/:id', requireRole('ADMIN', 'MODERATOR'), catalogController.updateDepartment);

// DELETE /api/admin/catalog/departments/:id  — ADMIN only (destructive)
router.delete('/departments/:id', requireRole('ADMIN'), catalogController.deleteDepartment);

// ─── Semesters ────────────────────────────────────────────────

// POST /api/admin/catalog/semesters
router.post('/semesters', requireRole('ADMIN', 'MODERATOR'), catalogController.createSemester);

// PUT  /api/admin/catalog/semesters/:id
router.put('/semesters/:id', requireRole('ADMIN', 'MODERATOR'), catalogController.updateSemester);

// DELETE /api/admin/catalog/semesters/:id  — ADMIN only
router.delete('/semesters/:id', requireRole('ADMIN'), catalogController.deleteSemester);

// ─── Subjects ─────────────────────────────────────────────────

// POST /api/admin/catalog/subjects
router.post('/subjects', requireRole('ADMIN', 'MODERATOR'), catalogController.createSubject);

// PUT  /api/admin/catalog/subjects/:id
router.put('/subjects/:id', requireRole('ADMIN', 'MODERATOR'), catalogController.updateSubject);

// DELETE /api/admin/catalog/subjects/:id  — ADMIN only
router.delete('/subjects/:id', requireRole('ADMIN'), catalogController.deleteSubject);

module.exports = router;
