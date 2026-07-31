// src/controllers/public.controller.js
// Thin HTTP layer — delegates all logic to public.service.js
'use strict';

const publicService = require('../services/public.service');
const { sendSuccess, sendError } = require('../utils/response');
const path = require('path');

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
    const { subjectCode, resourceType, message } = req.body;

    const request = await publicService.createRequest({
      subjectCode,
      resourceType,
      message,
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
