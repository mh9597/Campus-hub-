// src/app.js — Express application setup
'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const publicRoutes   = require('./routes/public.routes');
const authRoutes     = require('./routes/auth.routes');
const adminRoutes    = require('./routes/admin.routes');
const resourceRoutes = require('./routes/resource.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// ─── Security Headers ─────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow static file serving
    xFrameOptions: false, // allow iframe embedding of PDFs by the frontend
    contentSecurityPolicy: false, // disable frame-ancestors block
  })
);

// ─── CORS ─────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true, // required for HttpOnly cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Request Logging ──────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'student-resource-hub-api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────

// Public student routes  (no auth)
app.use('/api', publicRoutes);

// Secure resource proxy (view + download) — no auth required
app.use('/api', resourceRoutes);

// Admin authentication routes
app.use('/api/admin/auth', authRoutes);

// Protected admin management routes
app.use('/api/admin', adminRoutes);

// ─── 404 + Global Error Handler ──────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
