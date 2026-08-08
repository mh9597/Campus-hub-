// src/services/public.service.js
// All public (no-auth) database operations.
'use strict';

const prisma = require('../config/prisma');

// ─── Semesters + Subjects (with resource counts) ─────────────

/**
 * Returns all departments, each containing semesters, each containing
 * subjects with an embedded _count of active resources.
 */
async function getSemesters() {
  const departments = await prisma.department.findMany({
    orderBy: { id: 'asc' },
    include: {
      semesters: {
        orderBy: { sortOrder: 'asc' },
        include: {
          subjects: {
            orderBy: { sortOrder: 'asc' },
            include: {
              _count: {
                select: {
                  resources: { where: { isActive: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  return departments;
}

// ─── Resources ────────────────────────────────────────────────

/**
 * Fetch active resources, optionally filtered by subjectCode or resourceType.
 * @param {{ subjectCode?: string, resourceType?: string }} filters
 */
async function getResources(filters = {}) {
  const { subjectCode, resourceType } = filters;

  const where = { isActive: true };

  if (subjectCode) {
    where.subject = { code: subjectCode };
  }
  if (resourceType) {
    where.resourceType = resourceType;
  }

  return prisma.resource.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      subject: {
        select: { id: true, code: true, title: true },
      },
    },
  });
}

/**
 * Fetch a single resource by ID, including full subject+semester+department context.
 * @param {string} id
 */
async function getResourceById(id) {
  return prisma.resource.findFirst({
    where: { id, isActive: true },
    include: {
      subject: {
        select: {
          id: true,
          code: true,
          title: true,
          icon: true,
          semester: {
            select: {
              id: true,
              semesterNumber: true,
              name: true,
              department: { select: { id: true, code: true, name: true } },
            },
          },
        },
      },
    },
  });
}

// ─── Opportunities & Announcements ───────────────────────────

/**
 * Returns active opportunities and active announcements in one payload.
 */
async function getOpportunities() {
  const [opportunities, announcements] = await Promise.all([
    prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { opportunities, announcements };
}

// ─── Student Submissions ──────────────────────────────────────

/**
 * Create a ResourceUpload submission (status defaults to PENDING).
 * @param {{ subjectCode: string, resourceType: string, title: string, description?: string, fileUrl?: string, fileKey?: string }} data
 */
async function createUpload(data) {
  return prisma.resourceUpload.create({ data });
}

/**
 * Create a ResourceRequest (status defaults to PENDING).
 * @param {{ subjectCode: string, resourceType: string, description: string, email: string }} data
 */
async function createRequest(data) {
  return prisma.resourceRequest.create({ data });
}

// ─── Newsletter ───────────────────────────────────────────────

/**
 * Subscribe an email. Silently succeeds if already subscribed.
 * @param {string} email
 */
async function createSubscriber(email) {
  return prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

module.exports = {
  getSemesters,
  getResources,
  getResourceById,
  getOpportunities,
  createUpload,
  createRequest,
  createSubscriber,
};
