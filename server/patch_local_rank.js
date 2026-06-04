const fs = require('fs');
const file = '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/client/src/pages/RecordDetailPage.jsx';
let content = fs.readFileSync(file, 'utf-8');

// Add localRank state
content = content.replace(
  "const [authMessage, setAuthMessage] = useState('');",
  "const [authMessage, setAuthMessage] = useState('');\n  const [localRank, setLocalRank] = useState('N/A');"
);

// Add fetching local rank
const fetchRecordFunc = `      // Increment view only once
      if (!viewIncremented.current) {
        viewIncremented.current = true;
        const viewRes = await apiCall(\`/social/\${recordId}/view\`, 'POST');
        setSocialStats(prev => ({ ...prev, views: viewRes.views }));
      }
      
      // Fetch Local Rank for Athlete
      if (data.country) {
        try {
          const rankings = await apiCall(\`/rankings/local?country=\${encodeURIComponent(data.country)}\`, 'GET');
          if (rankings && rankings.length > 0) {
            const athleteRank = rankings.findIndex(r => r.id === data.user_id) + 1;
            if (athleteRank > 0) setLocalRank(athleteRank);
          }
        } catch (e) {
          console.error("Failed to fetch local rank", e);
        }
      }`;
      
content = content.replace(
  `      // Increment view only once
      if (!viewIncremented.current) {
        viewIncremented.current = true;
        const viewRes = await apiCall(\`/social/\${recordId}/view\`, 'POST');
        setSocialStats(prev => ({ ...prev, views: viewRes.views }));
      }`,
  fetchRecordFunc
);

// Replace rendered Rank
content = content.replace(
  `<div style={{ fontSize: '16px', fontWeight: '900', color: '#FFD700' }}>#{record.ranking || 'N/A'}</div>`,
  `<div style={{ fontSize: '16px', fontWeight: '900', color: '#FFD700' }}>#{localRank}</div>`
);

content = content.replace(
  `<div style={{ fontSize: '11px', color: '#888', fontWeight: '700' }}>RANK</div>`,
  `<div style={{ fontSize: '11px', color: '#888', fontWeight: '700' }}>LOCAL RANK</div>`
);

fs.writeFileSync(file, content, 'utf-8');
