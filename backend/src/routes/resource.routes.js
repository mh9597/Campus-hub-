// src/routes/resource.routes.js
// Secure backend proxy streaming endpoints — publicly accessible.
// Mounted at /api via app.js
'use strict';

const { Router } = require('express');
const { param }  = require('express-validator');

const resourceController = require('../controllers/resource.controller');
const { handleValidationErrors } = require('../middlewares/validate.middleware');

const router = Router();

const validateId = [
  param('id').isUUID().withMessage('Invalid resource ID'),
  handleValidationErrors,
];

// GET /api/resources/:id/view
// Streams the file inline — the browser renders it (PDF viewer, image, etc.)
// The Google Drive URL is NEVER exposed to the client.
router.get('/resources/:id/view', validateId, resourceController.viewResourceSecurely);

// GET /api/resources/:id/download
// Same proxy stream but forces a browser Save-As dialog with the human-readable title.
router.get('/resources/:id/download', validateId, resourceController.downloadResourceSecurely);

module.exports = router;
