const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/recordExploreController.js');
let content = fs.readFileSync(file, 'utf-8');

// Insert require
if (!content.includes("socialController")) {
  content = content.replace("const supabase = require('../config/supabase');", "const supabase = require('../config/supabase');\nconst socialController = require('./socialController');");
}

// Helper to replace `res.json({ sections });` and similar with `socialController.mergeSocialStats`
// Actually, it's easier to just use regex to wrap the returned records or modify the res.json.

// getHomepageSections
content = content.replace(
  "sections.recent_uploads = [];", 
  "sections.recent_uploads = [];\n    sections.featured = socialController.mergeSocialStats(sections.featured);\n    sections.newly_verified = socialController.mergeSocialStats(sections.newly_verified);\n    sections.top_ranked = socialController.mergeSocialStats(sections.top_ranked);"
);

// getNewRecords
content = content.replace(
  "res.json({ records: filtered, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(filtered), total: count, limit: parseInt(limit) });"
);

// getFeaturedRecords
content = content.replace(
  "res.json({ records: data, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });"
);

// getMostViewedRecords
// NOTE: getMostViewedRecords should theoretically sort by views. But since views are not in Supabase, we would have to fetch all and sort in JS.
// For now, let's just merge stats.
content = content.replace(
  "res.json({ records: data, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });"
);

// getTopRankedRecords
content = content.replace(
  "res.json({ records: data, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });"
);

// getRecordsByCategory
content = content.replace(
  "res.json({ records: data, total: count, category_id: categoryId, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(data), total: count, category_id: categoryId, limit: parseInt(limit) });"
);

// getLocalRecords
content = content.replace(
  "res.json({ records: data, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });"
);

// getAllRecords
content = content.replace(
  "res.json({ records: filtered, total: count, limit: parseInt(limit) });",
  "res.json({ records: socialController.mergeSocialStats(filtered), total: count, limit: parseInt(limit) });"
);

fs.writeFileSync(file, content, 'utf-8');
