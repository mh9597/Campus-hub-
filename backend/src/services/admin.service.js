// src/services/admin.service.js
// Protected admin operations — uploads review, resource CRUD, opportunities.
'use strict';

const prisma = require('../config/prisma');
const driveService = require('./drive.service');

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
 * On APPROVE: moves file to final nested folder, renames it if needed, and creates a Resource.
 * @param {string} id  Upload UUID
 * @param {'APPROVED'|'REJECTED'} action
 * @param {Object} updatedData Optional modified fields (title, subjectCode, resourceType)
 */
async function reviewUpload(id, action, updatedData = {}) {
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
    const finalSubjectCode = updatedData.subjectCode || upload.subjectCode;
    const finalTitle = updatedData.title || upload.title;
    const finalResourceType = updatedData.resourceType || upload.resourceType;

    // Find the subject by code
    const subject = await prisma.subject.findUnique({
      where: { code: finalSubjectCode },
      include: { semester: { include: { department: true } } },
    });

    if (!subject) {
      const err = new Error(`Cannot approve: subject with code "${finalSubjectCode}" not found`);
      err.statusCode = 422;
      throw err;
    }

    // Move file in Google Drive if it exists
    if (upload.driveFileId) {
      try {
        const departmentName = subject?.semester?.department?.name || 'Student Uploads';
        const semesterName = subject?.semester?.name || 'General';
        const subjectName = subject?.title || 'General';

        const targetFolderId = await driveService.resolveFolderPath(departmentName, semesterName, subjectName, finalResourceType);
        const pendingFolderId = process.env.GOOGLE_DRIVE_PENDING_FOLDER_ID;
        
        await driveService.moveFileInDrive(upload.driveFileId, targetFolderId, pendingFolderId);

        if (finalTitle !== upload.title) {
          await driveService.renameInDrive(upload.driveFileId, finalTitle, null);
        }
      } catch (driveErr) {
        console.error('[admin.service] Failed to move/rename file on Drive:', driveErr);
        // We still continue to approve the DB record if they want, but usually it's better to throw
        // Throwing ensures the DB doesn't get out of sync if the Drive move fails
        const err = new Error(`Failed to move file in Google Drive: ${driveErr.message}`);
        err.statusCode = 502;
        throw err;
      }
    }

    let mimeType = null;
    let fileSize = null;
    if (upload.driveFileId) {
      try {
        const meta = await driveService.getDriveFileMetadata(upload.driveFileId);
        mimeType = meta?.mimeType || null;
        fileSize = meta?.size ? parseInt(meta.size, 10) : null;
      } catch (metaErr) {
        console.warn('[admin.service] Could not fetch drive metadata:', metaErr.message);
      }
    }

    // Create the actual Resource + mark upload approved in a transaction
    const [updatedUpload, createdResource] = await prisma.$transaction([
      prisma.resourceUpload.update({
        where: { id },
        data: { status: 'APPROVED' },
      }),
      prisma.resource.create({
        data: {
          subjectId:    subject.id,
          title:        finalTitle,
          description:  upload.description,
          resourceType: finalResourceType,
          fileUrl:      upload.fileUrl  || null,
          fileKey:      upload.fileKey  || null,
          driveFileId:  upload.driveFileId || null,
          webViewLink:  upload.webViewLink  || null,
          mimeType:     upload.mimeType || mimeType || null,
          fileSize:     fileSize || null,
          source:       'student_upload',
          isActive:     true,
        },
      }),
    ]);

    return { upload: updatedUpload, resource: createdResource };
  }

  // REJECTED — delete from Drive if applicable
  if (upload.driveFileId) {
    try {
      await driveService.deleteFromDrive(upload.driveFileId);
    } catch (err) {
      console.error('[admin.service] Failed to delete rejected file from Drive:', err.message);
    }
  }

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
  return requests;
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
