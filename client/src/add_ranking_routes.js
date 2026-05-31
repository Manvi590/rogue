const fs = require('fs');
const path = require('path');

// Read App.jsx
const appPath = path.join(__dirname, 'App.jsx');
let content = fs.readFileSync(appPath, 'utf-8');

// Add new imports for ranking pages
const importSection = `import GlobalRankings from './pages/GlobalRankings'`;
const newImports = `import GlobalRankingsPage from './pages/GlobalRankingsPage'
import MemberProfilePage from './pages/MemberProfilePage'`;

content = content.replace(importSection, newImports);

// Update routes
const oldRoute = `<Route path="/global-rankings" element={<GlobalRankings />} />`;
const newRoute = `<Route path="/global-rankings" element={<GlobalRankingsPage />} />
            <Route path="/profile/:username" element={<MemberProfilePage />} />`;

content = content.replace(oldRoute, newRoute);

// Write back
fs.writeFileSync(appPath, content);

console.log('✅ Added new ranking routes to App.jsx');
