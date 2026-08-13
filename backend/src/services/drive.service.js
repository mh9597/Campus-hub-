// src/services/drive.service.js
// Google Drive API helper — OAuth2 User Auth (personal Gmail quota).
//
// Folder structure on Drive:
//   Root (GOOGLE_DRIVE_FOLDER_ID)
//     └── [Department Name]          e.g. "Computer Engineering"
//           └── [Semester Name]      e.g. "Semester 3"
//                 └── [ResourceType] e.g. "Notes"
//                       └── file.pdf
'use strict';

const { google }   = require('googleapis');
const { Readable } = require('stream');

// ── Startup validation ────────────────────────────────────────

const REQUIRED = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'GOOGLE_DRIVE_FOLDER_ID',
];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    throw new Error(`[drive.service] Missing required env var: ${key}`);
  }
}

// ── OAuth2 client ─────────────────────────────────────────────

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// ── In-process folder ID cache ────────────────────────────────
// Key: "<parentId>/<folderName>"  →  Value: Drive folder ID string
// Avoids redundant Drive API calls on every upload within the same process
// lifetime. Cleared on server restart — safe, just causes one extra Drive
// API round-trip on first upload after restart.

const folderCache = new Map();

// ── Folder resolution ─────────────────────────────────────────

/**
 * Find an existing Drive folder by name inside a parent, or create it.
 * Results are memoised in `folderCache` for the lifetime of the process.
 *
 * @param {string} folderName      Human-readable folder name (e.g. "Notes")
 * @param {string} parentFolderId  ID of the parent Drive folder
 * @returns {Promise<string>}      Drive folder ID of the resolved/created folder
 */
async function getOrCreateSubfolder(folderName, parentFolderId) {
  const cacheKey = `${parentFolderId}/${folderName}`;

  if (folderCache.has(cacheKey)) {
    return folderCache.get(cacheKey);
  }

  // Sanitise the name so it's safe to embed in a Drive query string
  const safeName = folderName.replace(/'/g, "\\'");

  // Search for an existing non-trashed folder with this name under the parent
  const listRes = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${safeName}' and '${parentFolderId}' in parents and trashed = false`,
    fields: 'files(id, name)',
    spaces:  'drive',
    pageSize: 1,
  });

  if (listRes.data.files && listRes.data.files.length > 0) {
    const folderId = listRes.data.files[0].id;
    folderCache.set(cacheKey, folderId);
    return folderId;
  }

  // Not found — create it
  const createRes = await drive.files.create({
    requestBody: {
      name:     folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents:  [parentFolderId],
    },
    fields: 'id',
  });

  const newFolderId = createRes.data.id;
  folderCache.set(cacheKey, newFolderId);

  console.log(`[drive.service] Created folder: "${folderName}" (${newFolderId}) under parent ${parentFolderId}`);
  return newFolderId;
}

/**
 * Resolve the full nested folder path, creating any missing levels.
 *
 * @param {string} departmentName  e.g. "Computer Engineering"
 * @param {string} semesterName    e.g. "Semester 3"
 * @param {string} resourceType    e.g. "Notes"
 * @returns {Promise<string>}      Drive ID of the innermost (ResourceType) folder
 */
async function resolveFolderPath(departmentName, semesterName, resourceType) {
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // Level 1 — Department
  const deptId = await getOrCreateSubfolder(departmentName, rootId);

  // Level 2 — Semester
  const semId = await getOrCreateSubfolder(semesterName, deptId);

  // Level 3 — Resource Type
  const typeId = await getOrCreateSubfolder(resourceType, semId);

  return typeId;
}

// ── Upload ────────────────────────────────────────────────────

/**
 * Upload a multer file object to Google Drive inside the correct nested folder.
 *
 * @param {{ buffer: Buffer, originalname: string, mimetype: string }} file
 *   The `req.file` object produced by multer memoryStorage.
 * @param {string} departmentName  e.g. "Computer Engineering"
 * @param {string} semesterName    e.g. "Semester 3"
 * @param {string} resourceType    e.g. "Notes"
 * @returns {Promise<{ fileId: string, webViewLink: string, webContentLink: string }>}
 */
async function uploadFileToDrive(file, departmentName, semesterName, resourceType) {
  // Resolve (or create) the nested folder structure first
  let targetFolderId;

  if (departmentName && semesterName && resourceType) {
    targetFolderId = await resolveFolderPath(departmentName, semesterName, resourceType);
  } else {
    // Fallback — dump straight into root if metadata is missing
    targetFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    console.warn('[drive.service] uploadFileToDrive called without full metadata — uploading to root folder');
  }

  // Convert in-memory buffer → readable stream (no disk I/O)
  const bodyStream = Readable.from(file.buffer);

  const uploadRes = await drive.files.create({
    requestBody: {
      name:    file.originalname,
      parents: [targetFolderId],
    },
    media: {
      mimeType: file.mimetype,
      body:     bodyStream,
    },
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = uploadRes.data.id;

  // Grant "anyone with the link" read access so the proxy stream can fetch it
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return {
    fileId,
    webViewLink:    uploadRes.data.webViewLink,
    webContentLink: uploadRes.data.webContentLink,
  };
}

// ── Stream (backend proxy) ────────────────────────────────────

/**
 * Returns a Node.js Readable stream for a Drive file.
 * Used by resource.controller.js to proxy-stream files to the client.
 *
 * @param {string} fileId  Google Drive file ID
 * @returns {Promise<import('stream').Readable>}
 */
async function getDriveFileStream(fileId) {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' },
  );
  return response.data;
}

// ── Metadata ──────────────────────────────────────────────────

/**
 * Fetch basic file metadata from Drive.
 *
 * @param {string} fileId
 * @returns {Promise<{ id: string, name: string, mimeType: string, size: string }>}
 */
async function getDriveFileMetadata(fileId) {
  const response = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size',
  });
  return response.data;
}

// ── Delete ────────────────────────────────────────────────────

/**
 * Permanently delete a file from Google Drive.
 * Tolerates 404 (already deleted manually) — logs a warning but does NOT throw,
 * so the DB record can still be cleaned up even if Drive is out of sync.
 *
 * @param {string} fileId  Google Drive file ID
 * @returns {Promise<void>}
 */
async function deleteFromDrive(fileId) {
  try {
    await drive.files.delete({ fileId });
  } catch (err) {
    const status = err?.response?.status ?? err?.code;
    if (status === 404) {
      console.warn(`[drive.service] deleteFromDrive: file ${fileId} not found on Drive (already deleted). Skipping.`);
      return; // non-fatal — DB deletion can still proceed
    }
    throw err; // re-throw for any other error (auth, server, etc.)
  }
}

// Alias kept for backwards compat with any legacy callers
const deleteFileFromDrive = deleteFromDrive;

// ── Rename ────────────────────────────────────────────────────

/**
 * Rename a file on Google Drive, preserving the original extension.
 *
 * @param {string} fileId   Google Drive file ID
 * @param {string} newTitle Human-readable new name (e.g. "CS301 Unit 2 Notes")
 * @param {string} [mimeType]  Original MIME type, used to derive the extension
 * @returns {Promise<{ id: string, name: string }>}
 */
async function renameInDrive(fileId, newTitle, mimeType) {
  // Derive extension from mimeType if no extension already in the title
  const MIME_EXT = {
    'application/pdf':                                            '.pdf',
    'application/msword':                                         '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-powerpoint':                              '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/vnd.ms-excel':                                   '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'image/jpeg':  '.jpg',
    'image/png':   '.png',
    'image/gif':   '.gif',
    'image/webp':  '.webp',
    'application/zip': '.zip',
  };

  // Sanitise: strip leading/trailing whitespace
  let safeName = (newTitle || 'Untitled').trim();

  // Append extension only if the name doesn't already end with one
  const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(safeName);
  if (!hasExt && mimeType && MIME_EXT[mimeType]) {
    safeName = `${safeName}${MIME_EXT[mimeType]}`;
  }

  const response = await drive.files.update({
    fileId,
    requestBody: { name: safeName },
    fields: 'id, name',
  });

  return response.data;
}

module.exports = {
  uploadFileToDrive,
  getDriveFileStream,
  getDriveFileMetadata,
  deleteFromDrive,
  deleteFileFromDrive, // backwards compat alias
  renameInDrive,
  // Exported for testing — not needed in controllers
  getOrCreateSubfolder,
  resolveFolderPath,
};

