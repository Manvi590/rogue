import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Heart, Zap, Trophy, TrendingUp, MapPin, User, Calendar, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

export default function ExploreRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('new'); // new, featured, viewed, ranked, category, local, global
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchRecords();
    fetchCategories();
  }, [filterType, sortBy]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let endpoint = '/records?status=verified';

      if (filterType === 'new') {
        endpoint += '&sort=newest&limit=20';
      } else if (filterType === 'featured') {
        endpoint += '&is_featured=true&limit=20';
      } else if (filterType === 'viewed') {
        endpoint += '&sort=mostViewed&limit=20';
      } else if (filterType === 'ranked') {
        endpoint += '&sort=topRanked&limit=20';
      }

      const data = await apiCall(endpoint, 'GET');
      setRecords(Array.isArray(data) ? data : data.records || []);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiCall('/categories', 'GET');
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchQuery || 
      (record.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !categoryFilter || record.category_id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'new', label: '🆕 New Records', icon: '✨' },
    { id: 'featured', label: '⭐ Featured', icon: '⭐' },
    { id: 'viewed', label: '👁️ Most Viewed', icon: '👁️' },
    { id: 'ranked', label: '🏆 Top Ranked', icon: '🏆' },
    { id: 'category', label: '📂 By Category', icon: '📂' },
    { id: 'local', label: '📍 Local', icon: '📍' },
    { id: 'global', label: '🌍 Global', icon: '🌍' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingTop: '120px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '950', color: 'white', margin: '0 0 8px 0' }}>
            🎬 Explore Records
          </h1>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
            Browse verified world records, achievements, and amazing performances
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ background: 'rgba(255,85,0,0.05)', border: '1px solid rgba(255,85,0,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Search size={20} color="#FF5500" />
            <input
              type="text"
              placeholder="Search by athlete, record title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none', fontWeight: '500' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'rgba(255,85,0,0.2)', border: 'none', color: '#FF5500', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '12px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                background: filterType === tab.id ? '#FF5500' : 'rgba(255,255,255,0.05)',
                border: filterType === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: filterType === tab.id ? 'white' : '#888',
                padding: '10px 18px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategoryFilter('')}
            style={{
              background: !categoryFilter ? '#FF5500' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '11px'
            }}
          >
            All Categories
          </button>
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                background: categoryFilter === cat.id ? '#FF5500' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: categoryFilter === cat.id ? 'white' : '#888',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Records Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <Zap size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>Loading records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No records found</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredRecords.map((record, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/record/${record.id}`)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  ':hover': { transform: 'translateY(-4px)' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', background: '#111', overflow: 'hidden' }}>
                  {record.thumbnail_url ? (
                    <img
                      src={record.thumbnail_url}
                      alt={record.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF5500 0%, #FFB84D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={48} color="white" opacity={0.3} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s ease' }} className="play-overlay">
                    <Play size={48} color="white" fill="white" />
                  </div>

                  {/* Status Badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#4ade80', color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
                    ✓ Verified
                  </div>

                  {/* Featured Badge */}
                  {record.is_featured && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#FFD700', color: 'black', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '900', color: 'white', margin: '0 0 8px 0', lineHeight: '1.3' }}>
                    {record.title}
                  </h3>

                  {/* Athlete Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <User size={14} color="#FF5500" />
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: '600' }}>
                      {record.user?.display_name || 'Unknown'}
                    </span>
                  </div>

                  {/* Category & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '11px', color: '#666' }}>
                    <span>{record.category_name || 'Category'}</span>
                    <span>{record.verified_at ? new Date(record.verified_at).toLocaleDateString() : 'Recent'}</span>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Eye size={14} color="#FF5500" style={{ margin: '0 auto' }} />
                      <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{record.views || 0}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Heart size={14} color="#FF5500" style={{ margin: '0 auto' }} />
                      <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{record.likes || 0}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <Trophy size={14} color="#FFD700" style={{ margin: '0 auto' }} />
                      <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>Rank</div>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/record/${record.id}`); }}
                    style={{
                      width: '100%',
                      background: '#FF5500',
                      border: 'none',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Play size={14} /> Watch Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .play-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
