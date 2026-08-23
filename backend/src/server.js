// src/server.js — HTTP server entry point
'use strict';

require('dotenv').config();

const app = require('./app');
const prisma = require('./config/prisma');

const PORT = parseInt(process.env.PORT, 10) || 3001;

async function startServer() {
  // Start HTTP listener immediately so health checks pass on deployment platforms like Render
  const server = app.listen(PORT, () => {
    console.log(`🚀  Server running on port ${PORT}`);
    console.log(`📁  Uploads served at http://localhost:${PORT}/uploads`);
    console.log(`🩺  Health check at http://localhost:${PORT}/health`);
    console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  try {
    await prisma.$connect();
    console.log('✅  Database connected successfully');
  } catch (err) {
    console.error('⚠️  Database connection warning:', err.message);
    console.error('⚠️  Server is running, but database features may fail until DATABASE_URL is properly configured.');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⛔  Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⛔  SIGTERM received. Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
