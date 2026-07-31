// src/controllers/admin.controller.js
// Protected admin management endpoints — delegates to admin.service.js
'use strict';

const adminService = require('../services/admin.service');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Uploads ──────────────────────────────────────────────────

// GET /api/admin/uploads?status=PENDING
async function getUploads(req, res, next) {
  try {
    const { status } = req.query;
    const valid = ['PENDING', 'APPROVED', 'REJECTED'];
    const statusFilter = valid.includes(status?.toUpperCase())
      ? status.toUpperCase()
      : 'PENDING';
    const uploads = await adminService.getUploads(statusFilter);
    return sendSuccess(res, uploads);
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/uploads/:id
async function reviewUpload(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action?.toUpperCase())) {
      return sendError(res, 'action must be APPROVED or REJECTED', 400);
    }
    const result = await adminService.reviewUpload(id, action.toUpperCase());
    return sendSuccess(res, result, 200, `Upload ${action.toLowerCase()} successfully`);
  } catch (err) {
    return next(err);
  }
}

// ─── Resource Requests ────────────────────────────────────────

// GET /api/admin/requests?status=PENDING
async function getRequests(req, res, next) {
  try {
    const { status } = req.query;
    const valid = ['PENDING', 'APPROVED', 'REJECTED'];
    const statusFilter = valid.includes(status?.toUpperCase())
      ? status.toUpperCase()
      : 'PENDING';
    const requests = await adminService.getRequests(statusFilter);
    return sendSuccess(res, requests);
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/requests/:id
async function reviewRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action?.toUpperCase())) {
      return sendError(res, 'action must be APPROVED or REJECTED', 400);
    }
    const result = await adminService.reviewRequest(id, action.toUpperCase());
    return sendSuccess(res, result, 200, `Request ${action.toLowerCase()} successfully`);
  } catch (err) {
    return next(err);
  }
}

// ─── Resources ────────────────────────────────────────────────

// GET /api/admin/resources
async function getResources(req, res, next) {
  try {
    const { subjectCode, search } = req.query;
    const data = await adminService.getResources({ subjectCode, search });
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/resources
async function createResource(req, res, next) {
  try {
    let fileUrl = req.body.fileUrl || null;
    let fileKey = req.body.fileKey || null;
    if (req.file) {
      fileKey = req.file.filename;
      fileUrl = `/uploads/${req.file.filename}`;
    }
    const resource = await adminService.createResource({
      subjectId: req.body.subjectId,
      title: req.body.title,
      description: req.body.description || null,
      resourceType: req.body.resourceType,
      fileUrl,
      fileKey,
      fileSize: req.file?.size || req.body.fileSize || null,
      mimeType: req.file?.mimetype || req.body.mimeType || null,
      source: req.body.source || 'admin',
    });
    return sendSuccess(res, resource, 201, 'Resource created');
  } catch (err) {
    return next(err);
  }
}

// PUT /api/admin/resources/:id
async function updateResource(req, res, next) {
  try {
    const { id } = req.params;
    const { subjectId: _s, createdAt: _c, ...updateData } = req.body;
    const resource = await adminService.updateResource(id, updateData);
    return sendSuccess(res, resource, 200, 'Resource updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/resources/:id  (soft-delete)
async function deleteResource(req, res, next) {
  try {
    const { id } = req.params;
    const resource = await adminService.deleteResource(id);
    return sendSuccess(res, resource, 200, 'Resource deactivated');
  } catch (err) {
    return next(err);
  }
}

// ─── Opportunities ────────────────────────────────────────────

// GET /api/admin/opportunities
async function getOpportunities(req, res, next) {
  try {
    const data = await adminService.getOpportunities();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/opportunities
async function createOpportunity(req, res, next) {
  try {
    const { title, description, category, tag, pinBg } = req.body;
    const opportunity = await adminService.createOpportunity({
      title,
      description: description || null,
      category: category || null,
      tag: tag || null,
      pinBg: pinBg || null,
    });
    return sendSuccess(res, opportunity, 201, 'Opportunity published');
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/opportunities/:id/toggle
async function toggleOpportunity(req, res, next) {
  try {
    const data = await adminService.toggleOpportunity(req.params.id);
    return sendSuccess(res, data, 200, 'Opportunity updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/opportunities/:id
async function deleteOpportunity(req, res, next) {
  try {
    await adminService.deleteOpportunity(req.params.id);
    return sendSuccess(res, null, 200, 'Opportunity deleted');
  } catch (err) {
    return next(err);
  }
}

// ─── Announcements ────────────────────────────────────────────

// GET /api/admin/announcements
async function getAnnouncements(req, res, next) {
  try {
    const data = await adminService.getAnnouncements();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/admin/announcements
async function createAnnouncement(req, res, next) {
  try {
    const { text, badge, color, deadline } = req.body;
    const data = await adminService.createAnnouncement({ text, badge, color, deadline });
    return sendSuccess(res, data, 201, 'Announcement created');
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/admin/announcements/:id/toggle
async function toggleAnnouncement(req, res, next) {
  try {
    const data = await adminService.toggleAnnouncement(req.params.id);
    return sendSuccess(res, data, 200, 'Announcement updated');
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/admin/announcements/:id
async function deleteAnnouncement(req, res, next) {
  try {
    await adminService.deleteAnnouncement(req.params.id);
    return sendSuccess(res, null, 200, 'Announcement deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getUploads, reviewUpload,
  getRequests, reviewRequest,
  getResources, createResource, updateResource, deleteResource,
  getOpportunities, createOpportunity, toggleOpportunity, deleteOpportunity,
  getAnnouncements, createAnnouncement, toggleAnnouncement, deleteAnnouncement,
};
