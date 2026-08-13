// src/services/gdrive.service.js
'use strict';

const { google } = require('googleapis');
const stream = require('stream');

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'];

// Replace escaped newlines with actual newlines in private key
const privateKey = process.env.GDRIVE_PRIVATE_KEY
  ? process.env.GDRIVE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : '';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GDRIVE_CLIENT_EMAIL,
    private_key: privateKey,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads a file buffer to Google Drive.
 * @param {Buffer} fileBuffer - The file buffer in memory
 * @param {string} originalName - The original name of the file
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<Object>} - The Google Drive file ID and webViewLink
 */
async function uploadFileToDrive(fileBuffer, originalName, mimeType) {
  const folderId = process.env.GDRIVE_FOLDER_ID;

  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  const fileMetadata = {
    name: originalName,
    parents: [folderId],
  };

  const media = {
    mimeType: mimeType,
    body: bufferStream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  // Make the file readable by anyone with the link
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return {
    fileId: response.data.id,
    webViewLink: response.data.webViewLink,
    webContentLink: response.data.webContentLink,
  };
}

/**
 * Gets a read stream for a Google Drive file.
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<stream.Readable>}
 */
async function getDriveFileStream(fileId) {
  const response = await drive.files.get(
    { fileId: fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  return response.data;
}

/**
 * Gets metadata for a Google Drive file.
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<Object>}
 */
async function getDriveFileMetadata(fileId) {
  const response = await drive.files.get({
    fileId: fileId,
    fields: 'id, name, mimeType, size',
  });
  return response.data;
}

/**
 * Deletes a file from Google Drive.
 * @param {string} fileId - The Google Drive file ID
 * @returns {Promise<void>}
 */
async function deleteFileFromDrive(fileId) {
  await drive.files.delete({ fileId });
}

module.exports = {
  uploadFileToDrive,
  getDriveFileStream,
  getDriveFileMetadata,
  deleteFileFromDrive,
};
