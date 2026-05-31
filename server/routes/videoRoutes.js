/**
 * Video Routes (Admin)
 * Routes for managing videos, evidence, and related content
 */

const express = require('express');
const router = express.Router();
const {
  getRecordVideos,
  createRecordVideo,
  updateRecordVideo,
  deleteRecordVideo,
  getAttemptVideos,
  createAttemptVideo,
  deleteAttemptVideo,
  getFeaturedVideos,
  createFeaturedVideo,
  deleteFeaturedVideo,
  getNewestRecordVideos,
  createNewestRecordVideo,
  deleteNewestRecordVideo,
  updateVideoThumbnail,
  getAllPhotoEvidence,
  createPhotoEvidence,
  verifyPhotoEvidence,
  rejectPhotoEvidence,
  deletePhotoEvidence,
  getVideoStats,
} = require('../controllers/videoController');
const {
  uploadVideoFile,
  uploadThumbnail,
  uploadEvidence,
  importYouTubeVideo,
  linkExternalVideo,
  validateYouTubeUrl,
  getAttemptHistoryVideos,
  createAttemptHistoryVideo,
  deleteAttemptHistoryVideo,
} = require('../controllers/videoUploadController');
const { videoUpload, thumbnailUpload, evidenceUpload } = require('../config/upload');
const { protect, admin } = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC ROUTES (no auth required)
// ==========================================
// Featured videos for homepage/display
router.get('/featured', getFeaturedVideos);
router.get('/newest', getNewestRecordVideos);

// Protect all routes below - require auth and admin privileges
router.use(protect);
router.use(admin);

// ==========================================
// 🎬 RECORD VIDEOS ROUTES (ADMIN)
// ==========================================
router.get('/record', getRecordVideos);
router.post('/record', createRecordVideo);
router.put('/record/:id', updateRecordVideo);
router.delete('/record/:id', deleteRecordVideo);

// ==========================================
// 🎥 ATTEMPT VIDEOS ROUTES
// ==========================================
router.get('/attempt', getAttemptVideos);
router.post('/attempt', createAttemptVideo);
router.delete('/attempt/:id', deleteAttemptVideo);

// ==========================================
// ⭐ FEATURED VIDEOS ROUTES (ADMIN)
// ==========================================
router.post('/featured', createFeaturedVideo);
router.delete('/featured/:id', deleteFeaturedVideo);

// ==========================================
// 🆕 NEWEST RECORDS VIDEOS ROUTES (ADMIN)
// ==========================================
router.post('/newest', createNewestRecordVideo);
router.delete('/newest/:id', deleteNewestRecordVideo);

// ==========================================
// 🖼️ THUMBNAIL MANAGEMENT ROUTES
// ==========================================
router.put('/:id/thumbnail', updateVideoThumbnail);

// ==========================================
// 📷 PHOTO EVIDENCE ROUTES
// ==========================================
router.get('/evidence/photos', getAllPhotoEvidence);
router.post('/evidence/photos', createPhotoEvidence);
router.put('/evidence/photos/:id/verify', verifyPhotoEvidence);
router.put('/evidence/photos/:id/reject', rejectPhotoEvidence);
router.delete('/evidence/photos/:id', deletePhotoEvidence);

// ==========================================
// 📊 STATS & ANALYTICS ROUTES
// ==========================================
router.get('/stats', getVideoStats);

// ==========================================
// 📤 FILE UPLOAD ROUTES
// ==========================================
router.post('/upload/video', videoUpload.single('video'), uploadVideoFile);
router.post('/upload/thumbnail', thumbnailUpload.single('thumbnail'), uploadThumbnail);
router.post('/upload/evidence', evidenceUpload.single('evidence'), uploadEvidence);

// ==========================================
// 🎬 YOUTUBE INTEGRATION ROUTES
// ==========================================
router.post('/youtube/import', importYouTubeVideo);
router.get('/youtube/validate', validateYouTubeUrl);

// ==========================================
// 📹 ATTEMPT HISTORY VIDEOS ROUTES
// ==========================================
router.get('/attempt-history', getAttemptHistoryVideos);
router.post('/attempt-history', createAttemptHistoryVideo);
router.delete('/attempt-history/:id', deleteAttemptHistoryVideo);

module.exports = router;
