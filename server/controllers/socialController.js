const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/social.json');

// Helper to read and write social data
const readSocialData = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}), 'utf-8');
  }
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (err) {
    return {};
  }
};

const writeSocialData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};

// Toggle like for a record
exports.toggleLike = (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;

    const data = readSocialData();
    if (!data[recordId]) {
      data[recordId] = { views: 0, likes: [], comments: [] };
    }

    const likes = data[recordId].likes;
    const index = likes.indexOf(userId);

    let isLiked = false;
    if (index === -1) {
      likes.push(userId); // Like
      isLiked = true;
    } else {
      likes.splice(index, 1); // Unlike
    }

    writeSocialData(data);
    res.json({ success: true, likes: likes.length, isLiked });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Increment views for a record
exports.incrementView = (req, res) => {
  try {
    const { recordId } = req.params;

    const data = readSocialData();
    if (!data[recordId]) {
      data[recordId] = { views: 0, likes: [], comments: [] };
    }

    data[recordId].views += 1;

    writeSocialData(data);
    res.json({ success: true, views: data[recordId].views });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a comment to a record
exports.addComment = (req, res) => {
  try {
    const { recordId } = req.params;
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const data = readSocialData();
    if (!data[recordId]) {
      data[recordId] = { views: 0, likes: [], comments: [] };
    }

    const newComment = {
      id: Date.now().toString(),
      userId: req.user.id,
      userName: req.user.name || req.user.username,
      userAvatar: req.user.profile_image,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    data[recordId].comments.push(newComment);
    writeSocialData(data);
    
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get social stats for a single record
exports.getSocialStats = (req, res) => {
  try {
    const { recordId } = req.params;
    // user ID might be optional if called without token
    const userId = req.user ? req.user.id : null;

    const data = readSocialData();
    const stats = data[recordId] || { views: 0, likes: [], comments: [] };

    res.json({
      views: stats.views || 0,
      likes: (stats.likes || []).length,
      isLiked: userId ? (stats.likes || []).includes(userId) : false,
      comments: stats.comments || []
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Used by other controllers to merge stats
exports.mergeSocialStats = (records) => {
  const data = readSocialData();
  return records.map(r => {
    const stats = data[r.id] || {};
    return {
      ...r,
      views: stats.views || 0,
      likes: (stats.likes || []).length,
      commentsCount: (stats.comments || []).length
    };
  });
};

exports.mergeSingleSocialStats = (record, userId) => {
  const data = readSocialData();
  const stats = data[record.id] || {};
  return {
    ...record,
    views: stats.views || 0,
    likes: (stats.likes || []).length,
    commentsCount: (stats.comments || []).length,
    isLiked: userId ? (stats.likes || []).includes(userId) : false
  };
};
