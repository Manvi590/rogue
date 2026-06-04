const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/recordController.js');
let content = fs.readFileSync(file, 'utf-8');

if (!content.includes("socialController")) {
  content = content.replace("const supabase = require('../config/supabase');", "const supabase = require('../config/supabase');\nconst socialController = require('./socialController');");
}

// In getAllRecords
content = content.replace(
  "res.status(200).json(data);",
  "res.status(200).json(socialController.mergeSocialStats(data));"
);

// In getRecordById
content = content.replace(
  "res.status(200).json(data);",
  "res.status(200).json(socialController.mergeSingleSocialStats(data, req.user ? req.user.id : null));"
);

fs.writeFileSync(file, content, 'utf-8');
