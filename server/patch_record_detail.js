const fs = require('fs');
const file = '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/client/src/pages/RecordDetailPage.jsx';
let content = fs.readFileSync(file, 'utf-8');

// Add social states
const oldUseState = `  const [shareMessage, setShareMessage] = useState('');`;
const newUseState = `  const [shareMessage, setShareMessage] = useState('');
  const [socialStats, setSocialStats] = useState({ views: 0, likes: 0, isLiked: false, comments: [] });
  const [commentText, setCommentText] = useState('');`;
content = content.replace(oldUseState, newUseState);

// Replace fetchRecord and add social fetches
const oldFetchRecord = `  const fetchRecord = async () => {
    try {
      setLoading(true);
      setVideoError(false);
      const data = await apiCall(\`/records/\${recordId}\`, 'GET');
      setRecord(data);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };`;

const newFetchRecord = `  const fetchRecord = async () => {
    try {
      setLoading(true);
      setVideoError(false);
      const data = await apiCall(\`/records/\${recordId}\`, 'GET');
      setRecord(data);
      
      // Fetch social stats
      const stats = await apiCall(\`/social/\${recordId}\`, 'GET');
      setSocialStats(stats);
      
      // Increment view
      const viewRes = await apiCall(\`/social/\${recordId}/view\`, 'POST');
      setSocialStats(prev => ({ ...prev, views: viewRes.views }));
      
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleLike = async () => {
    try {
      const res = await apiCall(\`/social/\${recordId}/like\`, 'POST');
      setSocialStats(prev => ({ ...prev, likes: res.likes, isLiked: res.isLiked }));
    } catch (error) {
      if (error.message.includes('No token')) alert('Please login to like this record.');
      else alert('Failed to like record.');
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await apiCall(\`/social/\${recordId}/comment\`, 'POST', { text: commentText });
      setSocialStats(prev => ({ ...prev, comments: [...prev.comments, res.comment] }));
      setCommentText('');
    } catch (error) {
      if (error.message.includes('No token')) alert('Please login to comment.');
      else alert('Failed to add comment.');
    }
  };`;
content = content.replace(oldFetchRecord, newFetchRecord);

// Replace rendered stats
content = content.replace(/{record\.views \|\| 0}/g, `{socialStats.views || 0}`);
content = content.replace(/{record\.likes \|\| 0}/g, `{socialStats.likes || 0}`);

// Make likes interactive
content = content.replace(
  `<div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <Heart size={18} color="#FF5500" />`,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }} onClick={handleToggleLike}>
                  <Heart size={18} color="#FF5500" fill={socialStats.isLiked ? "#FF5500" : "none"} />`
);

// Add comments section
const commentSection = `
            {/* Comments Section */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Comments ({socialStats.comments.length})</h3>
              
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input 
                  type="text" 
                  placeholder="Add a public comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#FF5500', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>
                  Post
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                {socialStats.comments.length === 0 ? (
                  <p style={{ color: '#888', fontSize: '14px' }}>No comments yet. Be the first to comment!</p>
                ) : (
                  socialStats.comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                         {c.userAvatar ? <img src={c.userAvatar} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <User size={20} color="#fff" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', color: 'white', fontSize: '14px' }}>{c.userName || 'User'}</span>
                          <span style={{ fontSize: '10px', color: '#666' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
`;
content = content.replace(`          </div>\n\n          {/* Sidebar */}`, commentSection + `\n          {/* Sidebar */}`);

fs.writeFileSync(file, content, 'utf-8');
