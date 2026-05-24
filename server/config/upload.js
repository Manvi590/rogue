/**
 * Upload Configuration
 * Handles file uploads for videos, thumbnails, and evidence
 * Vercel-compatible: uses /tmp on serverless, local /uploads otherwise
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// On Vercel (serverless), use /tmp since the filesystem is read-only.
// In development/other environments, use local uploads folder.
const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
const baseDir = isVercel ? '/tmp' : path.join(__dirname, '../uploads');

const uploadsDir = isVercel ? '/tmp' : path.join(baseDir);
const videosDir = isVercel ? '/tmp/videos' : path.join(baseDir, 'videos');
const thumbnailsDir = isVercel ? '/tmp/thumbnails' : path.join(baseDir, 'thumbnails');
const evidenceDir = isVercel ? '/tmp/evidence' : path.join(baseDir, 'evidence');

// Safely create directories — won't throw on read-only (Vercel) filesystem
[uploadsDir, videosDir, thumbnailsDir, evidenceDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    // Silently ignore on read-only serverless filesystems
    console.warn(`Could not create upload directory ${dir}: ${e.message}`);
  }
});

// Configure storage for different file types
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, thumbnailsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const evidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, evidenceDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filters
const videoFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid video format. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image format. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

const evidenceFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file format`), false);
  }
};

// Create multer instances
const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for videos
});

const thumbnailUpload = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images
});

const evidenceUpload = multer({
  storage: evidenceStorage,
  fileFilter: evidenceFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for evidence
});

module.exports = {
  videoUpload,
  thumbnailUpload,
  evidenceUpload,
  uploadsDir,
  videosDir,
  thumbnailsDir,
  evidenceDir,
};
