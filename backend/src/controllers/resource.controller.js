// src/controllers/resource.controller.js
// Backend proxy streaming — the browser never sees a Google Drive URL.
'use strict';

const path          = require('path');
const fs            = require('fs');
const publicService = require('../services/public.service');
const driveService  = require('../services/drive.service');
const { UPLOAD_DIR } = require('../config/multer');

// Fallback MIME map for old local files that have no mimeType stored in DB
const EXT_MIME_MAP = {
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

/**
 * Core proxy handler — shared by viewResourceSecurely and downloadResourceSecurely.
 *
 * @param {string} dispositionType  'inline' or 'attachment'
 */
async function proxyResource(req, res, dispositionType) {
  const { id } = req.params;
  const resource = await publicService.getResourceById(id);

  if (!resource) {
    return res.status(404).send('Resource not found.');
  }

  const safeTitle = (resource.title || 'file')
    .replace(/[^a-zA-Z0-9._\- ]/g, '_')
    .trim();

  // ── Path A: Drive proxy — preferred for all new uploads ───────
  if (resource.driveFileId) {
    const ext = path.extname(resource.title || '').toLowerCase();
    const mimeType = resource.mimeType || EXT_MIME_MAP[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `${dispositionType}; filename="${encodeURIComponent(resource.title || safeTitle)}"`
    );
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    let driveStream;
    try {
      driveStream = await driveService.getDriveFileStream(resource.driveFileId);
    } catch (driveErr) {
      console.error('[proxyResource] Drive stream error:', driveErr.message);
      if (!res.headersSent) {
        return res.status(502).send('Could not fetch file from storage.');
      }
      return;
    }

    driveStream.on('error', (streamErr) => {
      console.error('[proxyResource] pipe error:', streamErr.message);
      if (!res.headersSent) res.status(500).send('Stream error.');
      else res.destroy();
    });

    return driveStream.pipe(res);
  }

  // ── Path B: Legacy local file — backward compat ───────────────
  const rawPath = resource.fileUrl || '';

  if (!rawPath) {
    return res.status(404).send('No file is attached to this resource.');
  }

  // If it's a full http URL and there's no driveFileId, just redirect
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return res.redirect(rawPath);
  }

  const filename     = path.basename(rawPath);
  const absolutePath = path.resolve(UPLOAD_DIR, filename);

  if (!absolutePath.startsWith(UPLOAD_DIR)) {
    return res.status(400).send('Invalid file path.');
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).send('File not found on server.');
  }

  const ext      = path.extname(filename).toLowerCase();
  const mimeType = resource.mimeType || EXT_MIME_MAP[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', mimeType);
  res.setHeader(
    'Content-Disposition',
    `${dispositionType}; filename="${safeTitle}${ext}"`,
  );
  res.setHeader('Cache-Control', 'private, max-age=300');

  const localStream = fs.createReadStream(absolutePath);
  localStream.on('error', (e) => {
    console.error('[proxyResource] local stream error:', e.message);
    if (!res.headersSent) res.status(500).send('Error reading file.');
    else res.destroy();
  });
  return localStream.pipe(res);
}

// ── Public handlers ───────────────────────────────────────────

/**
 * GET /api/resources/:id/view
 * Renders the file inline in the browser (PDF viewer, image, etc.)
 */
async function viewResourceSecurely(req, res) {
  try {
    await proxyResource(req, res, 'inline');
  } catch (err) {
    console.error('[viewResourceSecurely] unexpected error:', err.message);
    if (!res.headersSent) res.status(500).send('Internal server error.');
  }
}

/**
 * GET /api/resources/:id/download
 * Forces the browser to save the file to disk with the human-readable title.
 */
async function downloadResourceSecurely(req, res) {
  try {
    await proxyResource(req, res, 'attachment');
  } catch (err) {
    console.error('[downloadResourceSecurely] unexpected error:', err.message);
    if (!res.headersSent) res.status(500).send('Internal server error.');
  }
}

module.exports = { viewResourceSecurely, downloadResourceSecurely };
