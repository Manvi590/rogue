import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Trophy, TrendingUp, Medal, Share2, Mail, MapPin, Calendar, Zap } from 'lucide-react';
import { apiCall } from '../utils/api';

export default function MemberProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [records, setRecords] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy URL");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Mock user data for now
        const mockUser = {
          id: 'user-' + username,
          username,
          display_name: username.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          profile_picture: 'https://via.placeholder.com/150',
          member_number: Math.floor(Math.random() * 10000),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
          email: username + '@example.com',
          created_at: new Date().toISOString()
        };
        setProfile(mockUser);

        // Mock ranking data
        const mockRanking = {
          user_id: mockUser.id,
          global_rank: Math.floor(Math.random() * 100) + 1,
          total_points: Math.floor(Math.random() * 50000) + 1000,
          verified_records_count: Math.floor(Math.random() * 20) + 1,
          world_records_count: Math.floor(Math.random() * 10),
          first_place_categories: Math.floor(Math.random() * 5),
          top_10_placements: Math.floor(Math.random() * 15),
          medals_earned: Math.floor(Math.random() * 10),
          tier_badge: ['Grand Champion', 'Elite Master', 'Pro Competitor', 'Challenger'][Math.floor(Math.random() * 4)],
          featured_records_count: Math.floor(Math.random() * 5),
          certificates_earned: Math.floor(Math.random() * 8)
        };
        setRanking(mockRanking);
        setRecords([]);
        setPointsHistory([]);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <Zap size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '120px' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <Award size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  const getTierBadge = (badge) => {
    const badges = {
      'Grand Champion': { emoji: '👑', color: '#FFD700' },
      'Elite Master': { emoji: '⭐', color: '#C0C0C0' },
      'Pro Competitor': { emoji: '🏆', color: '#CD7F32' },
      'Challenger': { emoji: '🎯', color: '#888' }
    };
    return badges[badge] || badges['Challenger'];
  };

  const tierBadge = getTierBadge(ranking?.tier_badge);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingTop: '120px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ background: 'rgba(255,85,0,0.1)', border: '1px solid rgba(255,85,0,0.2)', borderRadius: '20px', padding: '40px', marginBottom: '40px', display: 'grid', gridTemplateColumns: '150px 1fr', gap: '32px', alignItems: 'start' }}>
          <div>
            <img
              src={profile.profile_picture}
              alt={profile.display_name}
              style={{ width: '150px', height: '150px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #FF5500' }}
            />
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '32px' }}>
              {tierBadge.emoji}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#FF5500', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {ranking?.tier_badge}
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '950', color: 'white', margin: '0 0 8px 0', letterSpacing: '-1px' }}>
                {profile.display_name}
              </h1>
              <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
                @{profile.username} • Member #{profile.member_number}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginTop: '24px' }}>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>RANK</div>
                <div style={{ color: '#FF5500', fontSize: '28px', fontWeight: '950' }}>
                  #{ranking?.global_rank}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>POINTS</div>
                <div style={{ color: 'white', fontSize: '28px', fontWeight: '950' }}>
                  {(ranking?.total_points || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>VERIFIED</div>
                <div style={{ color: '#FFD700', fontSize: '28px', fontWeight: '950' }}>
                  {ranking?.verified_records_count}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>W.R.</div>
                <div style={{ color: '#4ade80', fontSize: '28px', fontWeight: '950' }}>
                  {ranking?.world_records_count}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>MEDALS</div>
                <div style={{ color: '#FF5500', fontSize: '28px', fontWeight: '950' }}>
                  {ranking?.medals_earned}
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              {profile.country && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#888' }}>
                  <MapPin size={14} /> {profile.country}
                </div>
              )}
              <button
                onClick={handleShare}
                style={{ background: copied ? '#4ade80' : '#FF5500', border: 'none', color: copied ? 'black' : 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', transition: 'all 0.3s' }}
              >
                <Share2 size={14} /> {copied ? 'Copied URL!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', overflowX: 'auto' }}>
          {['overview', 'achievements', 'videos'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#FF5500' : 'transparent',
                border: 'none',
                color: activeTab === tab ? 'white' : '#888',
                padding: '12px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '700',
                textTransform: 'uppercase',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'achievements' && '⭐ Achievements'}
              {tab === 'videos' && '🎥 Videos'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Trophy size={24} color="#FF5500" />
                <h3 style={{ color: 'white', fontWeight: '900', margin: 0 }}>First Place</h3>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '950', color: '#FF5500' }}>
                {ranking?.first_place_categories}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <TrendingUp size={24} color="#FFD700" />
                <h3 style={{ color: 'white', fontWeight: '900', margin: 0 }}>Top 10</h3>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '950', color: '#FFD700' }}>
                {ranking?.top_10_placements}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Award size={24} color="#4ade80" />
                <h3 style={{ color: 'white', fontWeight: '900', margin: 0 }}>Certificates</h3>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '950', color: '#4ade80' }}>
                {ranking?.certificates_earned}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {[
              { icon: '👑', label: 'Grand Champion', earned: ranking?.tier_badge === 'Grand Champion' },
              { icon: '⭐', label: 'Elite Master', earned: ['Grand Champion', 'Elite Master'].includes(ranking?.tier_badge) },
              { icon: '🏆', label: 'Pro Competitor', earned: true },
              { icon: '🥇', label: 'First Place', earned: (ranking?.first_place_categories || 0) > 0 },
              { icon: '🥈', label: 'Top 10', earned: (ranking?.top_10_placements || 0) > 0 },
              { icon: '📜', label: 'Certified', earned: (ranking?.certificates_earned || 0) > 0 }
            ].map((achievement, idx) => (
              <div
                key={idx}
                style={{
                  background: achievement.earned ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.02)',
                  border: achievement.earned ? '1px solid rgba(255,85,0,0.3)' : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  opacity: achievement.earned ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{achievement.icon}</div>
                <div style={{ color: achievement.earned ? 'white' : '#888', fontWeight: '700', fontSize: '12px' }}>
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ width: '100%', position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <iframe
                  src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0"
                  title="Featured Record Video"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ background: '#FF5500', color: 'white', display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', marginBottom: '8px' }}>FEATURED RECORD</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: 'white' }}>World Record Performance</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.5' }}>
                  Watch the amazing performance that secured the world record. Verified by ROGUE officials.
                </p>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ width: '100%', position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <iframe
                  src="https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=0"
                  title="Training Video"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ background: '#333', color: 'white', display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '900', marginBottom: '8px' }}>TRAINING</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: 'white' }}>Behind The Scenes</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.5' }}>
                  A look into the intense training regimen required to break records.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
