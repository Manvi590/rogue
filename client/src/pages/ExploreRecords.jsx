import React, { useState, useEffect } from 'react';
import { Search, Eye, Heart, Zap, Trophy, Play, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall, formatProductImage } from '../utils/api';
import Navbar from '../components/Navbar';
import PageNav from '../components/PageNav';
import Footer from '../components/Footer';

export default function ExploreRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('new');
  const [localStats, setLocalStats] = useState({});

  useEffect(() => {
    try {
      const stats = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rogue_stat_')) {
          const recordId = key.replace('rogue_stat_', '');
          stats[recordId] = JSON.parse(localStorage.getItem(key));
        }
      }
      setLocalStats(stats);
    } catch (e) {}
  }, []);

  const handleWatchRecord = (e, recordId) => {
    e.stopPropagation();
    const stat = localStats[recordId] || { views: 0, likes: 0, liked: false };
    const newStat = { ...stat, views: stat.views + 1 };
    setLocalStats(prev => ({ ...prev, [recordId]: newStat }));
    localStorage.setItem(`rogue_stat_${recordId}`, JSON.stringify(newStat));
    navigate(`/record/${recordId}`);
  };

  const handleToggleLike = (e, recordId) => {
    e.stopPropagation();
    const stat = localStats[recordId] || { views: 0, likes: 0, liked: false };
    const newLiked = !stat.liked;
    const newLikes = stat.likes + (newLiked ? 1 : -1);
    const newStat = { ...stat, liked: newLiked, likes: newLikes < 0 ? 0 : newLikes };
    setLocalStats(prev => ({ ...prev, [recordId]: newStat }));
    localStorage.setItem(`rogue_stat_${recordId}`, JSON.stringify(newStat));
  };

  const categories = ['All', 'Athletics', 'Strength', 'Endurance', 'Gaming', 'Skills'];
  const tabs = [
    { id: 'new', label: '🆕 New Records' },
    { id: 'featured', label: '⭐ Featured' },
    { id: 'viewed', label: '👁️ Most Viewed' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
    fetchRecords(q, activeCategory, filterType);
  }, [location.search, activeCategory, filterType]);

  const fetchRecords = async (q = '', category = 'All', filter = 'new') => {
    try {
      setLoading(true);
      let endpoint = '/records/explore/all';
      const params = new URLSearchParams();
      if (q) params.append('search', q);
      if (category && category !== 'All') params.append('category', category);
      if (filter) params.append('filter', filter);
      const qs = params.toString();
      if (qs) endpoint += `?${qs}`;

      const data = await apiCall(endpoint, 'GET');
      setRecords(data.records || []);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  let filteredRecords = records.filter(r => {
    const matchesSearch = !searchQuery || (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r.user?.display_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || (r.category || '').toLowerCase() === activeCategory.toLowerCase() || (r.category_name || '').toLowerCase() === activeCategory.toLowerCase();
    
    // Featured status is managed by admin / backend, with local fallback for legacy stats.
    const matchesFeatured = filterType === 'featured' ? (r.is_featured || r.isFeatured || localStats[r.id]?.isFeatured) : true;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  if (filterType === 'viewed') {
    filteredRecords.sort((a, b) => {
      const viewsA = (a.views || 0) + (localStats[a.id]?.views || 0);
      const viewsB = (b.views || 0) + (localStats[b.id]?.views || 0);
      return viewsB - viewsA;
    });
    
    if (filteredRecords.length > 0) {
      const maxViews = (filteredRecords[0].views || 0) + (localStats[filteredRecords[0].id]?.views || 0);
      filteredRecords = filteredRecords.filter(r => {
        const v = (r.views || 0) + (localStats[r.id]?.views || 0);
        return v === maxViews;
      });
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', paddingBottom: '0' }}>
      <Navbar />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 60px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <p style={{ color: '#FF6A00', fontWeight: '700', fontSize: '14px', letterSpacing: '1px', marginBottom: '8px' }}>GLOBAL ARCHIVE</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>EXPLORE RECORDS</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', borderRadius: '99px', padding: '8px 16px', border: '1px solid #333' }}>
            <Search size={20} color="#888" />
            <input
              type="text"
              placeholder="Search by athlete, record or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none', marginLeft: '10px', minWidth: '280px' }}
            />
          </form>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? '#FF6A00' : '#1a1a1a',
                color: 'white',
                border: activeCategory === cat ? 'none' : '1px solid #333',
                borderRadius: '99px',
                padding: '10px 20px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '12px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                background: filterType === tab.id ? '#FF5500' : 'rgba(255,255,255,0.03)',
                border: filterType === tab.id ? 'none' : '1px solid rgba(255,255,255,0.06)',
                color: filterType === tab.id ? 'white' : '#888',
                padding: '10px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <Zap size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: 600 }}>No records found</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredRecords.map((record) => {
              const stat = localStats[record.id] || { views: 0, likes: 0, liked: false, isFeatured: false };
              const displayViews = (record.views || 0) + stat.views;
              const displayLikes = (record.likes || 0) + stat.likes;
              const isLiked = stat.liked;
              const isFeatured = record.is_featured || record.isFeatured || stat.isFeatured;

              return (
              <div
                key={record.id}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', background: '#111' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF5500 0%, #FFB84D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trophy size={48} color="white" opacity={0.3} />
                  </div>
                  {record.thumbnail_url && record.thumbnail_url !== "pending_upload" && (
                    <img 
                      src={formatProductImage(record.thumbnail_url)} 
                      alt={record.title} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                    {(record.category || record.category_name || 'Category').toString().toUpperCase()}
                  </div>

                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#4ade80', color: 'black', padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 900 }}>
                    ✓ Verified
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: 'white', margin: '0 0 8px 0' }}>{record.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <User size={14} color="#FF5500" />
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{record.user?.display_name || 'Unknown'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 11, color: '#666' }}>
                    <span>{record.category_name || record.category || 'Category'}</span>
                    <span>{record.verified_at ? new Date(record.verified_at).toLocaleDateString() : 'Recent'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 12 }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Eye size={14} color="#FF5500" />
                      <div style={{ fontSize: 10, color: '#888', marginTop: 6 }}>{displayViews}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }} onClick={(e) => handleToggleLike(e, record.id)}>
                      <Heart size={14} color="#FF5500" fill={isLiked ? "#FF5500" : "none"} />
                      <div style={{ fontSize: 10, color: '#888', marginTop: 6 }}>{displayLikes}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Trophy size={14} color="#FFD700" />
                      <div style={{ fontSize: 10, color: '#888', marginTop: 6 }}>Rank</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={(e) => handleWatchRecord(e, record.id)} style={{ flex: 1, background: '#FF5500', border: 'none', color: 'white', padding: '10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Play size={14} /> Watch
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`\n        .play-overlay:hover { opacity: 1 !important; }\n      `}</style>
      <Footer />
    </div>
  );
}
