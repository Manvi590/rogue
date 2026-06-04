const fs = require('fs');

const filesToUpdateDate = [
  'client/src/pages/ChallengeVerify.jsx',
  'client/src/pages/Appeals.jsx',
  'client/src/pages/Admin.jsx',
  'client/src/pages/Profile.jsx'
];

filesToUpdateDate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/type="date"/g, "type=\"date\" max={new Date().toISOString().split('T')[0]}");
    fs.writeFileSync(file, content);
    console.log('Updated dates in', file);
  }
});

const filesToUpdateLabels = [
  'client/src/pages/Verify.jsx',
  'client/src/pages/ChallengeVerify.jsx',
  'client/src/pages/Signup.jsx',
  'client/src/pages/Appeals.jsx'
];

filesToUpdateLabels.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Regex for rgba(255, 255, 255, 0.4)
    content = content.replace(/color:\s*"rgba\(255,\s*255,\s*255,\s*0\.4\)"/g, 'color: "white"');
    content = content.replace(/color:\s*"rgba\(255,255,255,0\.4\)"/g, 'color: "white"');
    fs.writeFileSync(file, content);
    console.log('Updated labels in', file);
  }
});
