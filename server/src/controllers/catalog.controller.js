// src/controllers/catalog.controller.js
// Thin HTTP handlers for the Academic Catalog — delegates all logic to catalog.service.js
'use strict';

const catalogService = require('../services/catalog.service');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Departments ──────────────────────────────────────────────

// GET /api/admin/catalog/departments
async function getDepartments(req, res, next) {
  try {
    const departments = await catalogService.getDepartments();
    return sendSuccess(res, departments);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/catalog/departments
async function createDepartment(req, res, next) {
  try {
    const { code, name } = req.body;
    if (!code || !name) return sendError(res, 'code and name are required', 400);
    const dept = await catalogService.createDepartment({ code, name });
    return sendSuccess(res, dept, 201, 'Department created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/catalog/departments/:id
async function updateDepartment(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid department id', 400);
    const dept = await catalogService.updateDepartment(id, req.body);
    return sendSuccess(res, dept, 200, 'Department updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/catalog/departments/:id
async function deleteDepartment(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid department id', 400);
    await catalogService.deleteDepartment(id);
    return sendSuccess(res, null, 200, 'Department deleted');
  } catch (err) {
    return next(err);
  }
}

// ─── Semesters ────────────────────────────────────────────────

// POST /api/admin/catalog/semesters
async function createSemester(req, res, next) {
  try {
    const { departmentId, semesterNumber, name, description, bgColor, pinColor } = req.body;
    if (!departmentId || !semesterNumber || !name) {
      return sendError(res, 'departmentId, semesterNumber, and name are required', 400);
    }
    const sem = await catalogService.createSemester({ departmentId, semesterNumber, name, description, bgColor, pinColor });
    return sendSuccess(res, sem, 201, 'Semester created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/catalog/semesters/:id
async function updateSemester(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid semester id', 400);
    const sem = await catalogService.updateSemester(id, req.body);
    return sendSuccess(res, sem, 200, 'Semester updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/catalog/semesters/:id
async function deleteSemester(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 'Invalid semester id', 400);
    await catalogService.deleteSemester(id);
    return sendSuccess(res, null, 200, 'Semester deleted');
  } catch (err) {
    return next(err);
  }
}

// ─── Subjects ─────────────────────────────────────────────────

// POST /api/admin/catalog/subjects
async function createSubject(req, res, next) {
  try {
    const { semesterId, code, title, description, icon, bgColor, pinColor, cardType, path } = req.body;
    if (!semesterId || !code || !title) {
      return sendError(res, 'semesterId, code, and title are required', 400);
    }
    const subject = await catalogService.createSubject({ semesterId, code, title, description, icon, bgColor, pinColor, cardType, path });
    return sendSuccess(res, subject, 201, 'Subject created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/catalog/subjects/:id
async function updateSubject(req, res, next) {
  try {
    const { id } = req.params;
    const subject = await catalogService.updateSubject(id, req.body);
    return sendSuccess(res, subject, 200, 'Subject updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/catalog/subjects/:id
async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params;
    await catalogService.deleteSubject(id);
    return sendSuccess(res, null, 200, 'Subject deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createSemester,
  updateSemester,
  deleteSemester,
  createSubject,
  updateSubject,
  deleteSubject,
};
