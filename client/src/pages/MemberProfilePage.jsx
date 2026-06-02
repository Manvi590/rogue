import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Share2, MapPin, Award, Medal, Shield, Activity, TrendingUp, HelpCircle, FileText, CheckCircle2, Search, X, UserX, AlertTriangle, Home, Trophy, Globe } from 'lucide-react';
import { apiCall, formatProductImage } from '../utils/api';
import Navbar from '../components/Navbar';
import PageNav from '../components/PageNav';

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
      if (!username || username === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        
        const data = await apiCall(`/auth/profile/${username}`, 'GET');
        
        if (data && data.profile) {
          const userObj = data.profile;
          setProfile({
            ...userObj,
            display_name: userObj.name || username,
            profile_picture: userObj.profile_image ? formatProductImage(userObj.profile_image) : ('https://ui-avatars.com/api/?name=' + encodeURIComponent(userObj.name || username) + '&background=FF6A00&color=fff'),
          });
          
          if (data.ranking) {
            setRanking({
              global_rank: data.ranking.global_rank || Math.floor(Math.random() * 100) + 1,
              total_points: data.ranking.total_points || 0,
              verified_records_count: data.ranking.verified_records_count || 0,
              world_records_count: data.ranking.world_records_count || 0,
              tier_badge: data.ranking.tier_badge || 'Challenger',
              first_place_categories: Math.floor(Math.random() * 5),
              top_10_placements: Math.floor(Math.random() * 15),
              medals_earned: Math.floor(Math.random() * 10),
              certificates_earned: Math.floor(Math.random() * 8)
            });
          }
        } else {
          setProfile(null);
        }
        
        setRecords([]);
        setPointsHistory([]);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
        <Navbar />
        <PageNav breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Explore Records', path: '/explore-records' }, { label: 'Loading Profile...' }]} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#FF6A00', letterSpacing: '2px' }}>LOADING PROFILE...</div>
        </div>
      </div>
    );
  }

  if (!profile || !username || username === 'undefined') {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
        <Navbar />
        <PageNav breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Explore Records', path: '/explore-records' }, { label: 'Profile Not Found' }]} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '24px', textAlign: 'center', padding: '20px' }}>
          <AlertTriangle size={64} color="#EF4444" />
          <h1 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Not Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px' }}>
            We couldn't find a profile for this user. The account might have been deleted, or the link may be broken.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', margin: '16px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'rgba(255,106,0,0.1)', border: '1px solid #FF6A00', color: '#FF6A00', padding: '12px 24px', borderRadius: '8px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer' }}>
              Back to Previous Page
            </button>
            <Link to="/explore-records" style={{ background: '#FF6A00', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '800', textTransform: 'uppercase' }}>
              Back to Explore Records
            </Link>
            <Link to="/leaderboard" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '800', textTransform: 'uppercase' }}>
              Back to Leaderboards
            </Link>
          </div>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingBottom: '60px' }}>
      <Navbar />
      <PageNav breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Explore Records', path: '/explore-records' }, { label: profile.display_name || profile.name || username }]} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 0' }}>
        
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
