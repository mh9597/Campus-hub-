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

    let fileUrl     = null;
    let fileKey     = null;
    let driveFileId = null;
    let webViewLink = null;

    if (req.file) {
      // ── Resolve Department + Semester names via subjectCode ──
      // Subject (by code) ➔ Semester ➔ Department
      let departmentName = 'Student Uploads';
      let semesterName   = 'General';

      if (subjectCode) {
        const subject = await prisma.subject.findUnique({
          where:   { code: subjectCode },
          include: { semester: { include: { department: true } } },
        });

        if (subject?.semester?.department?.name) {
          departmentName = subject.semester.department.name;
        }
        if (subject?.semester?.name) {
          semesterName = subject.semester.name;
        }
      }

      // ── Upload into Root ➔ Department ➔ Semester ➔ ResourceType ──
      const result = await driveService.uploadFileToDrive(
        req.file,
        departmentName,
        semesterName,
        resourceType || 'General',
      );

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
