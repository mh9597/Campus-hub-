// src/config/multer.js — Memory storage with separate limits for students vs admins
'use strict';

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Keep UPLOAD_DIR so old local-file streaming in public.controller still resolves paths
const UPLOAD_DIR = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Memory storage — files live in req.file.buffer, never touch disk ──
const storage = multer.memoryStorage();

// ── MIME-type allow-lists ──────────────────────────────────────

const STUDENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'application/zip',
];

const ADMIN_MIME_TYPES = [
  ...STUDENT_MIME_TYPES,
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/webp',
  'text/plain',
];

// ── Filter factories ───────────────────────────────────────────

function makeFileFilter(allowedTypes) {
  return (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          `File type not allowed: ${file.mimetype}`,
        ),
        false,
      );
    }
  };
}

// ── Exports ───────────────────────────────────────────────────

/** Used on student submission routes — 15 MB cap, stricter MIME list */
const studentUpload = multer({
  storage,
  fileFilter: makeFileFilter(STUDENT_MIME_TYPES),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 }, // 15 MB
});

/** Used on admin resource routes — 50 MB cap, full MIME list */
const adminUpload = multer({
  storage,
  fileFilter: makeFileFilter(ADMIN_MIME_TYPES),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 }, // 50 MB
});

/** Legacy alias — keeps any remaining imports working */
const upload = adminUpload;

module.exports = { upload, studentUpload, adminUpload, UPLOAD_DIR };
