// src/services/admin.service.js
// Protected admin operations — uploads review, resource CRUD, opportunities.
'use strict';

const prisma = require('../config/prisma');

// ─── Uploads Management ───────────────────────────────────────

/**
 * List all ResourceUploads, optionally filtered by status.
 * @param {'PENDING'|'APPROVED'|'REJECTED'|undefined} status
 */
async function getUploads(status = 'PENDING') {
  return prisma.resourceUpload.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Approve or reject a ResourceUpload.
 * On APPROVE: auto-creates a Resource from the upload data.
 * @param {string} id  Upload UUID
 * @param {'APPROVED'|'REJECTED'} action
 */
async function reviewUpload(id, action) {
  const upload = await prisma.resourceUpload.findUnique({ where: { id } });

  if (!upload) {
    const err = new Error('Upload not found');
    err.statusCode = 404;
    throw err;
  }

  if (upload.status !== 'PENDING') {
    const err = new Error(`Upload is already ${upload.status}`);
    err.statusCode = 409;
    throw err;
  }

  if (action === 'APPROVED') {
    // Find the subject by code
    const subject = await prisma.subject.findUnique({
      where: { code: upload.subjectCode },
    });

    if (!subject) {
      const err = new Error(
        `Cannot approve: subject with code "${upload.subjectCode}" not found`
      );
      err.statusCode = 422;
      throw err;
    }

    // Create the actual Resource + mark upload approved in a transaction
    const [updatedUpload, createdResource] = await prisma.$transaction([
      prisma.resourceUpload.update({
        where: { id },
        data: { status: 'APPROVED' },
      }),
      prisma.resource.create({
        data: {
          subjectId: subject.id,
          title: upload.title,
          description: upload.description,
          resourceType: upload.resourceType,
          fileUrl: upload.fileUrl || '',
          fileKey: upload.fileKey,
          source: 'student_upload',
          isActive: true,
        },
      }),
    ]);

    return { upload: updatedUpload, resource: createdResource };
  }

  // REJECTED — just update status
  const updatedUpload = await prisma.resourceUpload.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
  return { upload: updatedUpload, resource: null };
}

// ─── Resource CRUD ────────────────────────────────────────────

/**
 * Directly create and publish a resource (admin-authored).
 * @param {{ subjectId: string, title: string, resourceType: string, fileUrl: string, [key: string]: any }} data
 */
async function createResource(data) {
  // Verify subject exists
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });
  if (!subject) {
    const err = new Error('Subject not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.resource.create({ data: { ...data, isActive: true } });
}

/**
 * Update fields of an existing resource.
 * @param {string} id
 * @param {Partial<Resource>} data
 */
async function updateResource(id, data) {
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Resource not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.resource.update({ where: { id }, data });
}

/**
 * Soft-delete a resource (sets isActive = false).
 * @param {string} id
 */
async function deleteResource(id) {
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error('Resource not found');
    err.statusCode = 404;
    throw err;
  }

  return prisma.resource.update({
    where: { id },
    data: { isActive: false },
  });
}

// ─── Opportunities ────────────────────────────────────────────

/**
 * Create/publish a new opportunity.
 * @param {{ title: string, description?: string, category?: string, tag?: string, pinBg?: string }} data
 */
async function createOpportunity(data) {
  return prisma.opportunity.create({ data: { ...data, isActive: true } });
}

/**
 * List all opportunities (admin view — includes inactive).
 */
async function getOpportunities() {
  return prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } });
}

// ─── Resource Requests ───────────────────────────────────────

/**
 * List ResourceRequests filtered by status.
 * @param {'PENDING'|'APPROVED'|'REJECTED'|undefined} status
 */
async function getRequests(status = 'PENDING') {
  const requests = await prisma.resourceRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  
  // Map description back to message for frontend compatibility
  return requests.map(req => ({
    ...req,
    message: req.description || '',
  }));
}

/**
 * Update the status of a ResourceRequest.
 * @param {string} id
 * @param {'APPROVED'|'REJECTED'} action
 */
async function reviewRequest(id, action) {
  const req = await prisma.resourceRequest.findUnique({ where: { id } });
  if (!req) {
    const err = new Error('Request not found');
    err.statusCode = 404;
    throw err;
  }
  return prisma.resourceRequest.update({
    where: { id },
    data: { status: action },
  });
}

// ─── Admin Resources (with subject info) ─────────────────────

/**
 * Return all resources (active + inactive) with subject info — for admin view.
 * @param {{ subjectCode?: string, search?: string }} filters
 */
async function getResources(filters = {}) {
  const { subjectCode, search } = filters;
  const where = {};
  if (subjectCode) where.subject = { code: subjectCode };
  if (search) where.title = { contains: search };

  return prisma.resource.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      subject: { select: { id: true, code: true, title: true, semesterId: true } },
    },
  });
}

// ─── Announcements ────────────────────────────────────────────

/**
 * List all announcements (admin — includes inactive).
 */
async function getAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
}

/**
 * Create a new announcement.
 */
async function createAnnouncement({ text, badge, color, deadline }) {
  return prisma.announcement.create({
    data: { text, badge: badge || null, color: color || null, deadline: deadline ? new Date(deadline) : null, isActive: true },
  });
}

/**
 * Toggle isActive on an announcement.
 */
async function toggleAnnouncement(id) {
  const item = await prisma.announcement.findUnique({ where: { id } });
  if (!item) { const err = new Error('Announcement not found'); err.statusCode = 404; throw err; }
  return prisma.announcement.update({ where: { id }, data: { isActive: !item.isActive } });
}

/**
 * Delete an announcement permanently.
 */
async function deleteAnnouncement(id) {
  return prisma.announcement.delete({ where: { id } });
}

/**
 * Toggle isActive on an opportunity.
 */
async function toggleOpportunity(id) {
  const item = await prisma.opportunity.findUnique({ where: { id } });
  if (!item) { const err = new Error('Opportunity not found'); err.statusCode = 404; throw err; }
  return prisma.opportunity.update({ where: { id }, data: { isActive: !item.isActive } });
}

/**
 * Delete an opportunity permanently.
 */
async function deleteOpportunity(id) {
  return prisma.opportunity.delete({ where: { id } });
}

module.exports = {
  getUploads,
  reviewUpload,
  getRequests,
  reviewRequest,
  createResource,
  updateResource,
  deleteResource,
  getResources,
  createOpportunity,
  getOpportunities,
  toggleOpportunity,
  deleteOpportunity,
  getAnnouncements,
  createAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
};
