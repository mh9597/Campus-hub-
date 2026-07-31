// src/services/auth.service.js
// Authentication business logic — login, refresh, logout, me.
'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../config/prisma');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt');

const REFRESH_EXPIRES_MS =
  parseInt(process.env.JWT_REFRESH_EXPIRES_MS, 10) || 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Helpers ──────────────────────────────────────────────────

/** Hash a refresh token string before storing it in DB */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/** Build the HttpOnly cookie options */
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: REFRESH_EXPIRES_MS,
    path: '/api/admin/auth',
  };
}

// ─── Login ────────────────────────────────────────────────────

/**
 * Validate credentials and issue token pair.
 * Returns { accessToken, refreshToken, cookieOptions, user }.
 */
async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });

  // Store hashed refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return {
    accessToken,
    refreshToken,
    cookieOptions: refreshCookieOptions(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

// ─── Refresh ──────────────────────────────────────────────────

/**
 * Validate the incoming refresh token, rotate it, return a new access token.
 * Returns { accessToken, newRefreshToken, cookieOptions }.
 */
async function refresh(cookieToken) {
  if (!cookieToken) {
    const err = new Error('Refresh token missing');
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(cookieToken);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  const tokenHash = hashToken(cookieToken);

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      userId: decoded.id,
      tokenHash,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!storedToken) {
    // Possible token reuse — revoke ALL tokens for this user
    await prisma.refreshToken.updateMany({
      where: { userId: decoded.id },
      data: { isRevoked: true },
    });
    const err = new Error('Refresh token reuse detected. Please log in again.');
    err.statusCode = 401;
    throw err;
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { isRevoked: true },
  });

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = signRefreshToken({ id: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return {
    accessToken,
    newRefreshToken,
    cookieOptions: refreshCookieOptions(),
  };
}

// ─── Logout ───────────────────────────────────────────────────

/**
 * Revoke all refresh tokens for the user (session-wide logout).
 */
async function logout(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
}

// ─── Me ───────────────────────────────────────────────────────

/**
 * Return the current user's profile (no passwordHash).
 */
async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = { login, refresh, logout, getMe, refreshCookieOptions };
