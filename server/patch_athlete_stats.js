const fs = require('fs');
const file = '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/client/src/pages/RecordDetailPage.jsx';
let content = fs.readFileSync(file, 'utf-8');

// Add state
content = content.replace(
  "const [localRank, setLocalRank] = useState('N/A');",
  "const [localRank, setLocalRank] = useState('N/A');\n  const [athleteProfile, setAthleteProfile] = useState(null);"
);

// Fetch athlete profile inside fetchRecord
const fetchAthleteProfileCode = `      // Fetch Global Rank for Athlete
      if (data.user_id) {
        try {
          const res = await apiCall(\`/rankings/global\`, 'GET');
          if (res && res.rankings && res.rankings.length > 0) {
            const athleteRank = res.rankings.findIndex(r => r.user_id === data.user_id) + 1;
            if (athleteRank > 0) setLocalRank(athleteRank);
          }
        } catch (e) {
          console.error("Failed to fetch global rank", e);
        }
      }
      
      // Fetch Athlete Profile stats
      if (data.user?.username) {
        try {
          const profileData = await apiCall(\`/auth/profile/\${data.user.username}\`, 'GET');
          setAthleteProfile(profileData);
        } catch (e) {
          console.error("Failed to fetch athlete profile", e);
        }
      }`;
      
content = content.replace(
  `      // Fetch Global Rank for Athlete
      if (data.user_id) {
        try {
          const res = await apiCall(\`/rankings/global\`, 'GET');
          if (res && res.rankings && res.rankings.length > 0) {
            const athleteRank = res.rankings.findIndex(r => r.user_id === data.user_id) + 1;
            if (athleteRank > 0) setLocalRank(athleteRank);
          }
        } catch (e) {
          console.error("Failed to fetch global rank", e);
        }
      }`,
  fetchAthleteProfileCode
);

// Replace rendered stats
content = content.replace(
  `<span style={{ color: '#FF5500', fontWeight: '700' }}>{record.user?.verified_records_count || 0}</span>`,
  `<span style={{ color: '#FF5500', fontWeight: '700' }}>{athleteProfile?.verified_records_count || record.user?.verified_records_count || 0}</span>`
);

content = content.replace(
  `<span style={{ color: '#FFD700', fontWeight: '700' }}>{record.user?.world_records_count || 0}</span>`,
  `<span style={{ color: '#FFD700', fontWeight: '700' }}>{athleteProfile?.world_records_count || record.user?.world_records_count || 0}</span>`
);

fs.writeFileSync(file, content, 'utf-8');
