// src/controllers/public.controller.js
// Thin HTTP layer — delegates all logic to public.service.js
'use strict';

const publicService = require('../services/public.service');
const driveService  = require('../services/drive.service');
const prisma        = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/response');


// GET /api/categories/semesters
async function getSemesters(req, res, next) {
  try {
    const data = await publicService.getSemesters();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// GET /api/resources?subjectCode=CS101&resourceType=notes
async function getResources(req, res, next) {
  try {
    const { subjectCode, resourceType } = req.query;
    const data = await publicService.getResources({ subjectCode, resourceType });
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// GET /api/resources/:id
async function getResourceById(req, res, next) {
  try {
    const { id } = req.params;
    let data = await publicService.getResourceById(id);
    if (!data) {
      return sendError(res, 'Resource not found', 404);
    }

    // If mimeType is missing but we have a drive file, fetch and permanently save it
    if (!data.mimeType && data.driveFileId) {
      try {
        const metadata = await driveService.getDriveFileMetadata(data.driveFileId);
        if (metadata.mimeType) {
          data.mimeType = metadata.mimeType;
          await prisma.resource.update({
            where: { id: data.id },
            data: { mimeType: metadata.mimeType }
          });
        }
      } catch (e) {
        console.error('[getResourceById] Failed to fetch drive mimeType:', e.message);
      }
    }

    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// GET /api/opportunities
async function getOpportunities(req, res, next) {
  try {
    const data = await publicService.getOpportunities();
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
}

// POST /api/submissions/upload  (multipart/form-data)
async function submitUpload(req, res, next) {
  try {
    const { subjectCode, resourceType, title, description } = req.body;

    let fileUrl     = null;
    let fileKey     = null;
    let driveFileId = null;
    let webViewLink = null;

    if (req.file) {
      // ── Upload directly to the Pending Contributions folder ──
      const pendingFolderId = process.env.GOOGLE_DRIVE_PENDING_FOLDER_ID;
      
      if (!pendingFolderId) {
        throw new Error('Server configuration error: GOOGLE_DRIVE_PENDING_FOLDER_ID is missing');
      }

      const result = await driveService.uploadDirectToDrive(req.file, pendingFolderId);

      driveFileId = result.fileId;
      webViewLink = result.webViewLink;
      fileKey     = result.fileId;      // keep fileKey for legacy compat
      fileUrl     = result.webViewLink; // stored for admin reference
    }

    const submission = await publicService.createUpload({
      subjectCode,
      resourceType,
      title,
      description: description || null,
      fileUrl,
      fileKey,
      driveFileId,
      webViewLink,
      mimeType: req.file ? req.file.mimetype : null,
    });

    return sendSuccess(res, submission, 201, 'Submission received and pending review');
  } catch (err) {
    return next(err);
  }
}

// POST /api/submissions/request  (application/json)
async function submitRequest(req, res, next) {
  try {
    const { subjectCode, resourceType, message, email } = req.body;

    const request = await publicService.createRequest({
      subjectCode: subjectCode || "", // Fallback if optional and empty
      resourceType,
      message,
      email,
    });

    return sendSuccess(res, request, 201, 'Request submitted successfully');
  } catch (err) {
    return next(err);
  }
}

// POST /api/subscribers
async function subscribe(req, res, next) {
  try {
    const { email } = req.body;
    const subscriber = await publicService.createSubscriber(email);
    return sendSuccess(res, subscriber, 201, 'Subscribed successfully');
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  getSemesters,
  getResources,
  getResourceById,
  getOpportunities,
  submitUpload,
  submitRequest,
  subscribe,
};
