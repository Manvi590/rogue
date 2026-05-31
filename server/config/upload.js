/**
 * Upload Configuration
 * Handles file uploads for videos, thumbnails, evidence, and product images
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
const imagesDir = isVercel ? '/tmp/images' : path.join(baseDir, 'images');

// Safely create directories — won't throw on read-only (Vercel) filesystem
[uploadsDir, videosDir, thumbnailsDir, evidenceDir, imagesDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    console.warn(`Could not create upload directory ${dir}: ${e.message}`);
  }
});

// ── Storage configs ──────────────────────────────────────────────────────────

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videosDir),
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + u + path.extname(file.originalname));
  },
});

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, thumbnailsDir),
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + u + path.extname(file.originalname));
  },
});

const evidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, evidenceDir),
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + u + path.extname(file.originalname));
  },
});

const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + u + path.extname(file.originalname).toLowerCase());
  },
});

const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'banner-' + u + path.extname(file.originalname).toLowerCase());
  },
});

// ── File filters ─────────────────────────────────────────────────────────────

const videoFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Invalid video format. Allowed: ${allowed.join(', ')}`), false);
};

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Invalid image format. Allowed: ${allowed.join(', ')}`), false);
};

const productImageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Invalid image format. Allowed: JPG, PNG, WEBP'), false);
};

const evidenceFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Invalid file format'), false);
};

// ── Multer instances ─────────────────────────────────────────────────────────

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
});

const thumbnailUpload = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const evidenceUpload = multer({
  storage: evidenceStorage,
  fileFilter: evidenceFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const productImageUpload = multer({
  storage: productImageStorage,
  fileFilter: productImageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const bannerUpload = multer({
  storage: bannerStorage,
  fileFilter: productImageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const challengeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, thumbnailsDir);
    else cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const u = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'challenge-' + u + path.extname(file.originalname).toLowerCase());
  },
});

const challengeFilter = (req, file, cb) => {
  const allowed = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/x-msvideo',
    'image/jpeg', 'image/png', 'image/webp'
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Invalid format for challenge upload. Allowed: MP4, MOV, WEBM, JPG, PNG, WEBP'), false);
};

const challengeUpload = multer({
  storage: challengeStorage,
  fileFilter: challengeFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

module.exports = {
  videoUpload,
  thumbnailUpload,
  evidenceUpload,
  productImageUpload,
  bannerUpload,
  challengeUpload,
  uploadsDir,
  videosDir,
  thumbnailsDir,
  evidenceDir,
  imagesDir,
};
