import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Download, Share2, Heart, Eye, Trophy, User, Calendar, MapPin, Award, CheckCircle, AlertCircle, Edit3 } from 'lucide-react';
import { apiCall } from '../utils/api';

export default function RecordDetailPage() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    fetchRecord();
  }, [recordId]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/records/${recordId}`, 'GET');
      setRecord(data);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <Play size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Loading record...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingTop: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Record not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      verified: '#4ade80',
      approved: '#3b82f6',
      pending: '#f59e0b',
      rejected: '#ef4444'
    };
    return colors[status] || '#888';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0c0c0e 0%, #1a1a1f 100%)', paddingTop: '120px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore-records')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#FF5500',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            marginBottom: '24px',
            fontSize: '12px'
          }}
        >
          ← Back to Explore Records
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          {/* Main Content */}
          <div>
            {/* Video Player */}
            <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', aspectRatio: '16/9', position: 'relative' }}>
              {record.evidence_url && !videoError ? (
                <video
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={() => setVideoError(true)}
                >
                  <source src={record.evidence_url} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FF5500 0%, #FFB84D 100%)', position: 'relative' }}>
                  {videoError && <div style={{ color: 'white', textAlign: 'center' }}>
                    <AlertCircle size={48} style={{ margin: '0 auto 16px' }} />
                    <p>Video not available</p>
                  </div>}
                  {!videoError && <Play size={48} color="white" fill="white" />}
                </div>
              )}
            </div>

            {/* Title and Status */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '950', color: 'white', margin: 0, lineHeight: '1.2' }}>
                  {record.title}
                </h1>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setLiked(!liked)}
                    style={{
                      background: liked ? '#FF5500' : 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: liked ? 'white' : '#888',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Heart size={20} fill={liked ? 'white' : 'none'} />
                  </button>
                  <button
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: 'none',
                      color: '#888',
                      padding: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                  <CheckCircle size={16} /> Verified
                </div>
                {record.is_world_record && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                    <Trophy size={16} /> World Record
                  </div>
                )}
                {record.is_featured && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 85, 0, 0.1)', color: '#FF5500', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                    <Award size={16} /> Featured
                  </div>
                )}
              </div>

              <p style={{ fontSize: '15px', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                {record.description}
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Record Score</div>
                <div style={{ fontSize: '28px', fontWeight: '950', color: '#FF5500' }}>{record.total_score || record.value}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Category</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'white' }}>{record.category_name}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Verified Date</div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>{new Date(record.verified_at).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Views</div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFD700' }}>{record.views || 0}</div>
              </div>
            </div>

            {/* Record Details */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>Record Details</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Attempt Date & Time
                  </div>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    {record.attempt_date ? new Date(record.attempt_date).toLocaleString() : 'Not specified'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Location
                  </div>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    {[record.city, record.state, record.country].filter(Boolean).join(', ') || 'Not specified'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Witnesses</div>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    {record.witnesses_count || 0} witnesses
                  </div>
                </div>

                <div>
                  <div style={{ color: '#888', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>Verification ID</div>
                  <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                    {record.id?.substring(0, 12)}...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Athlete Card */}
            <div style={{ background: 'rgba(255,85,0,0.1)', border: '1px solid rgba(255,85,0,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: '#FF5500', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Athlete Profile
              </h3>

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#FF5500', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: '900' }}>
                  {record.user?.display_name?.charAt(0) || 'A'}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '900', color: 'white', margin: '0 0 4px 0' }}>
                  {record.user?.display_name || 'Unknown Athlete'}
                </h4>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                  Member #{record.user?.member_number || 'N/A'}
                </p>
              </div>

              <button
                onClick={() => navigate(`/profile/${record.user?.username}`)}
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
                  marginBottom: '12px'
                }}
              >
                View Profile
              </button>

              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#888' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Total Records:</span>
                  <span style={{ color: '#FF5500', fontWeight: '700' }}>{record.user?.verified_records_count || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>World Records:</span>
                  <span style={{ color: '#FFD700', fontWeight: '700' }}>{record.user?.world_records_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'white', marginBottom: '16px', textTransform: 'uppercase' }}>
                Record Stats
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <Eye size={18} color="#FF5500" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: '700' }}>VIEWS</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>{record.views || 0}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <Heart size={18} color="#FF5500" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: '700' }}>LIKES</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>{record.likes || 0}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <Trophy size={18} color="#FFD700" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: '700' }}>RANK</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#FFD700' }}>#{record.ranking || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,85,0,0.3)',
                  color: '#FF5500',
                  padding: '12px',
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
                <Download size={16} /> Download Video
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#888',
                  padding: '12px',
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
                <Share2 size={16} /> Share Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
