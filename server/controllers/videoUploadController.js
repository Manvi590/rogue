/**
 * Video Upload & YouTube Integration Controller
 * Handles file uploads and YouTube video imports
 */

const Video = require('../models/Video');
const { videoUpload, thumbnailUpload, evidenceUpload } = require('../config/upload');
const youtubeUtils = require('../utils/youtubeIntegration');
const path = require('path');

// ==========================================
// 📤 FILE UPLOAD HANDLERS
// ==========================================

/**
 * @desc    Upload a video file
 * @route   POST /api/admin/upload/video
 * @access  Private/Admin
 */
const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/videos/${req.file.filename}`;
    const fileInfo = {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
      originalName: req.file.originalname,
    };

    res.json(fileInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Upload a thumbnail image
 * @route   POST /api/admin/upload/thumbnail
 * @access  Private/Admin
 */
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/thumbnails/${req.file.filename}`;
    const fileInfo = {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
      originalName: req.file.originalname,
    };

    res.json(fileInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Upload evidence file (photo or document)
 * @route   POST /api/admin/upload/evidence
 * @access  Private/Admin
 */
const uploadEvidence = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/evidence/${req.file.filename}`;
    const fileInfo = {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
      originalName: req.file.originalname,
    };

    res.json(fileInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🎬 YOUTUBE INTEGRATION HANDLERS
// ==========================================

/**
 * @desc    Import video from YouTube URL
 * @route   POST /api/admin/videos/youtube/import
 * @access  Private/Admin
 */
const importYouTubeVideo = async (req, res) => {
  try {
    const {
      youtubeUrl,
      recordId,
      attemptId,
      videoType,
      title,
      description,
      isPublished = true,
    } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ message: 'youtubeUrl is required' });
    }

    // Validate and extract video ID
    const videoId = youtubeUtils.extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    // Generate URLs
    const watchUrl = youtubeUtils.generateYouTubeWatchUrl(videoId);
    const embedUrl = youtubeUtils.generateYouTubeEmbedUrl(videoId);
    const thumbnailUrl = youtubeUtils.generateYouTubeThumbnailUrl(videoId);

    // Attempt to fetch metadata (optional, requires API key)
    let metadata = null;
    try {
      metadata = await youtubeUtils.fetchYouTubeMetadata(videoId);
    } catch (error) {
      console.warn('Could not fetch YouTube metadata:', error.message);
    }

    // Create video record
    const { data: videoData, error } = await Video.createVideo({
      recordId,
      attemptId,
      userId: req.user.id,
      videoType: videoType || Video.VIDEO_TYPES.RECORD,
      title: title || metadata?.title || 'YouTube Video',
      description: description || metadata?.description,
      videoUrl: embedUrl,
      thumbnailUrl: thumbnailUrl || metadata?.thumbnail,
      source: Video.VIDEO_SOURCES.YOUTUBE,
      youtubeVideoId: videoId,
      duration: metadata?.duration,
      isPublished,
    });

    if (error) throw error;

    res.status(201).json({
      ...videoData,
      metadata: metadata || { videoId, watchUrl, embedUrl },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Link external video URL
 * @route   POST /api/admin/videos/external/link
 * @access  Private/Admin
 */
const linkExternalVideo = async (req, res) => {
  try {
    const {
      videoUrl,
      thumbnailUrl,
      recordId,
      attemptId,
      videoType,
      title,
      description,
      duration,
      isPublished = true,
    } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: 'videoUrl is required' });
    }

    const { data, error } = await Video.createVideo({
      recordId,
      attemptId,
      userId: req.user.id,
      videoType: videoType || Video.VIDEO_TYPES.RECORD,
      title: title || 'External Video',
      description,
      videoUrl,
      thumbnailUrl,
      source: Video.VIDEO_SOURCES.EXTERNAL_URL,
      duration,
      isPublished,
    });

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Validate YouTube URL
 * @route   GET /api/admin/videos/youtube/validate
 * @access  Private/Admin
 */
const validateYouTubeUrl = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: 'url parameter is required' });
    }

    const videoId = youtubeUtils.extractYouTubeVideoId(url);

    if (!videoId) {
      return res.json({ valid: false, message: 'Invalid YouTube URL' });
    }

    // Try to fetch metadata if possible
    let metadata = null;
    try {
      metadata = await youtubeUtils.fetchYouTubeMetadata(videoId);
    } catch (error) {
      console.warn('Could not fetch metadata:', error.message);
    }

    res.json({
      valid: true,
      videoId,
      watchUrl: youtubeUtils.generateYouTubeWatchUrl(videoId),
      embedUrl: youtubeUtils.generateYouTubeEmbedUrl(videoId),
      thumbnailUrl: youtubeUtils.generateYouTubeThumbnailUrl(videoId),
      metadata: metadata || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 📹 ATTEMPT HISTORY VIDEOS
// ==========================================

/**
 * @desc    Get all attempt history videos
 * @route   GET /api/admin/videos/attempt-history
 * @access  Private/Admin
 */
const getAttemptHistoryVideos = async (req, res) => {
  try {
    const { data, error } = await Video.getVideos({
      videoType: Video.VIDEO_TYPES.ATTEMPT_HISTORY,
    });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create attempt history video
 * @route   POST /api/admin/videos/attempt-history
 * @access  Private/Admin
 */
const createAttemptHistoryVideo = async (req, res) => {
  try {
    const {
      attemptId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      source,
      youtubeVideoId,
      duration,
    } = req.body;

    if (!attemptId || !videoUrl) {
      return res.status(400).json({ message: 'attemptId and videoUrl are required' });
    }

    const { data, error } = await Video.createVideo({
      attemptId,
      userId: req.user.id,
      videoType: Video.VIDEO_TYPES.ATTEMPT_HISTORY,
      title: title || 'Attempt History',
      description,
      videoUrl,
      thumbnailUrl,
      source: source || Video.VIDEO_SOURCES.UPLOADED,
      youtubeVideoId,
      duration,
      isPublished: true,
    });

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete attempt history video
 * @route   DELETE /api/admin/videos/attempt-history/:id
 * @access  Private/Admin
 */
const deleteAttemptHistoryVideo = async (req, res) => {
  try {
    const { error } = await Video.deleteVideo(req.params.id);

    if (error) throw error;
    res.json({ message: 'Attempt history video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadVideoFile,
  uploadThumbnail,
  uploadEvidence,
  importYouTubeVideo,
  linkExternalVideo,
  validateYouTubeUrl,
  getAttemptHistoryVideos,
  createAttemptHistoryVideo,
  deleteAttemptHistoryVideo,
};
