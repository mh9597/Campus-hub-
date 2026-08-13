// src/controllers/public.controller.js
// Thin HTTP layer — delegates all logic to public.service.js
'use strict';

const fs = require('fs');
const path = require('path');
const publicService = require('../services/public.service');
const { sendSuccess, sendError } = require('../utils/response');
const { UPLOAD_DIR } = require('../config/multer');

// Mime-type map for inline serving
const MIME_MAP = {
  '.pdf':  'application/pdf',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt':  'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xls':  'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.txt':  'text/plain',
  '.zip':  'application/zip',
};

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
    const data = await publicService.getResourceById(id);
    if (!data) {
      return sendError(res, 'Resource not found', 404);
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

    let fileUrl = null;
    let fileKey = null;

    if (req.file) {
      fileKey = req.file.filename;
      // Store a relative path — the frontend resolveFileUrl() prepends the server origin.
      // This avoids hardcoding localhost and keeps it portable across environments.
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const submission = await publicService.createUpload({
      subjectCode,
      resourceType,
      title,
      description: description || null,
      fileUrl,
      fileKey,
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

// GET /api/resources/:id/view
// Streams local files inline (fixes auto-download). Redirects cloud URLs directly.
async function viewResource(req, res) {
  try {
    const { id } = req.params;
    const resource = await publicService.getResourceById(id);

    if (!resource) {
      return res.status(404).send('Resource not found.');
    }

    const rawPath = resource.fileUrl || resource.url || '';

    if (!rawPath) {
      return res.status(404).send('No file is attached to this resource.');
    }

    // ── Cloud / CDN URL → redirect, let browser handle it directly ──
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      return res.redirect(rawPath);
    }

    // ── Local file: resolve to absolute path on disk ──────────────
    // rawPath is stored as e.g. "/uploads/file-xyz.pdf"
    const filename = path.basename(rawPath);
    const absolutePath = path.resolve(UPLOAD_DIR, filename);

    // Security: make sure the resolved path is still inside UPLOAD_DIR
    if (!absolutePath.startsWith(UPLOAD_DIR)) {
      return res.status(400).send('Invalid file path.');
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send('File not found on server. It may have been moved or deleted.');
    }

    // ── Set headers so the browser renders inline, never downloads ─
    const ext = path.extname(filename).toLowerCase();
    const mimeType = MIME_MAP[ext] || 'application/octet-stream';
    const safeTitle = encodeURIComponent(resource.title || 'file');

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${safeTitle}${ext}"`);
    res.setHeader('Cache-Control', 'private, max-age=300'); // 5-min browser cache

    // ── Stream the file, handle errors so requests never hang ──────
    const stream = fs.createReadStream(absolutePath);

    stream.on('error', (streamErr) => {
      console.error('[viewResource] stream error:', streamErr.message);
      // Only send a header if we haven't started writing yet
      if (!res.headersSent) {
        res.status(500).send('Error reading file.');
      } else {
        res.destroy();
      }
    });

    stream.pipe(res);
  } catch (err) {
    console.error('[viewResource] unexpected error:', err.message);
    if (!res.headersSent) {
      return res.status(500).send('Internal server error while loading resource.');
    }
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
  viewResource,
};
