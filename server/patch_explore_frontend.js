const fs = require('fs');
const file = '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/client/src/pages/ExploreRecords.jsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace localStats useEffect
content = content.replace(/useEffect\(\(\) => \{\n    try \{\n      const stats = \{\};\n      for \(let i = 0; i < localStorage.length; i\+\+\) \{[\s\S]*?\} catch \(e\) \{\}\n  \}, \[\]\);/g, '');

// Replace handleWatchRecord
const oldHandleWatch = `  const handleWatchRecord = (e, recordId) => {
    e.stopPropagation();
    const stat = localStats[recordId] || { views: 0, likes: 0, liked: false };
    const newStat = { ...stat, views: stat.views + 1 };
    setLocalStats(prev => ({ ...prev, [recordId]: newStat }));
    localStorage.setItem(\`rogue_stat_\${recordId}\`, JSON.stringify(newStat));
    navigate(\`/record/\${recordId}\`);
  };`;
const newHandleWatch = `  const handleWatchRecord = (e, recordId) => {
    e.stopPropagation();
    navigate(\`/record/\${recordId}\`);
  };`;
content = content.replace(oldHandleWatch, newHandleWatch);

// Replace handleToggleLike
const oldHandleToggleLike = `  const handleToggleLike = (e, recordId) => {
    e.stopPropagation();
    const stat = localStats[recordId] || { views: 0, likes: 0, liked: false };
    const newLiked = !stat.liked;
    const newLikes = stat.likes + (newLiked ? 1 : -1);
    const newStat = { ...stat, liked: newLiked, likes: newLikes < 0 ? 0 : newLikes };
    setLocalStats(prev => ({ ...prev, [recordId]: newStat }));
    localStorage.setItem(\`rogue_stat_\${recordId}\`, JSON.stringify(newStat));
  };`;
const newHandleToggleLike = `  const handleToggleLike = async (e, recordId) => {
    e.stopPropagation();
    try {
      const res = await apiCall(\`/social/\${recordId}/like\`, 'POST');
      setRecords(records.map(r => r.id === recordId ? { ...r, isLiked: res.isLiked, likes: res.likes } : r));
    } catch (err) {
      if (err.message.includes('No token provided')) alert('Please login to like records!');
    }
  };`;
content = content.replace(oldHandleToggleLike, newHandleToggleLike);

// Replace localStats references in rendering
content = content.replace(/const stat = localStats\[record.id\] \|\| \{ views: 0, likes: 0, liked: false, isFeatured: false \};\n              const displayViews = \(record.views \|\| 0\) \+ stat.views;\n              const displayLikes = \(record.likes \|\| 0\) \+ stat.likes;\n              const isLiked = stat.liked;\n              const isFeatured = record.is_featured \|\| record.isFeatured \|\| stat.isFeatured;/g,
  `const displayViews = record.views || 0;
              const displayLikes = record.likes || 0;
              const isLiked = record.isLiked;
              const isFeatured = record.is_featured || record.isFeatured;`);

// Clean up any remaining localStats refs in sorting/filtering
content = content.replace(/const matchesFeatured = filterType === 'featured' \? \(r.is_featured \|\| r.isFeatured \|\| localStats\[r.id\]\?\.isFeatured\) : true;/g,
  `const matchesFeatured = filterType === 'featured' ? (r.is_featured || r.isFeatured) : true;`);

content = content.replace(/const viewsA = \(a.views \|\| 0\) \+ \(localStats\[a.id\]\?\.views \|\| 0\);\n      const viewsB = \(b.views \|\| 0\) \+ \(localStats\[b.id\]\?\.views \|\| 0\);/g,
  `const viewsA = a.views || 0;\n      const viewsB = b.views || 0;`);

content = content.replace(/const maxViews = \(filteredRecords\[0\].views \|\| 0\) \+ \(localStats\[filteredRecords\[0\].id\]\?\.views \|\| 0\);\n      filteredRecords = filteredRecords.filter\(r => \{\n        const v = \(r.views \|\| 0\) \+ \(localStats\[r.id\]\?\.views \|\| 0\);\n        return v === maxViews;\n      \}\);/g,
  `const maxViews = filteredRecords[0].views || 0;\n      filteredRecords = filteredRecords.filter(r => (r.views || 0) === maxViews);`);

// Remove unused state
content = content.replace(/const \[localStats, setLocalStats\] = useState\(\{\}\);\n/g, '');

fs.writeFileSync(file, content, 'utf-8');
