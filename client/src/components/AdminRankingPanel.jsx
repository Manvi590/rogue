import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Trash2, Plus } from 'lucide-react';
import { apiCall } from '../utils/api';

export default function AdminRankingPanel({ user }) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [rankings, setRankings] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pointsAdjustment, setPointsAdjustment] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [editingRule, setEditingRule] = useState(null);
  const [editingRuleValues, setEditingRuleValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'rankings') fetchRankings();
    else if (activeTab === 'rules') fetchRules();
  }, [activeTab]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/rankings/global?limit=100', 'GET');
      setRankings(data.rankings || []);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/rankings/rules', 'GET');
      setRules(data.rules || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustPoints = async () => {
    if (!selectedUser || !adjustReason || pointsAdjustment === 0) {
      alert('Please fill all fields');
      return;
    }

    try {
      await apiCall('/rankings/adjust-points', 'POST', {
        user_id: selectedUser,
        points: parseInt(pointsAdjustment),
        reason: adjustReason,
        notes: adjustNotes
      }, user.token);

      alert('Points adjusted successfully!');
      setSelectedUser('');
      setPointsAdjustment(0);
      setAdjustReason('');
      setAdjustNotes('');
      fetchRankings();
    } catch (error) {
      console.error('Error adjusting points:', error);
      alert('Error adjusting points');
    }
  };

  const handleUpdateRule = async (ruleName) => {
    if (!editingRuleValues[ruleName]) return;

    try {
      await apiCall(`/rankings/rules/${ruleName}`, 'PUT', editingRuleValues[ruleName], user.token);
      alert('Rule updated!');
      setEditingRule(null);
      fetchRules();
    } catch (error) {
      console.error('Error updating rule:', error);
      alert('Error updating rule');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {['rankings', 'rules', 'adjust'].map(tab => (
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
              fontSize: '12px'
            }}
          >
            {tab === 'rankings' && '📊 Rankings'}
            {tab === 'rules' && '⚙️ Rules'}
            {tab === 'adjust' && '✏️ Adjust Points'}
          </button>
        ))}
      </div>

      {/* Rankings Tab */}
      {activeTab === 'rankings' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>All User Rankings</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #FF5500' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Rank</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Points</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Verified</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>World Records</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700' }}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {rankings.slice(0, 50).map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px' }}>{r.global_rank || idx + 1}</td>
                    <td style={{ padding: '12px' }}>{r.users?.display_name || 'Unknown'}</td>
                    <td style={{ padding: '12px', color: '#FFD700', fontWeight: '700' }}>{r.total_points}</td>
                    <td style={{ padding: '12px' }}>{r.verified_records_count}</td>
                    <td style={{ padding: '12px', color: '#4ade80' }}>{r.world_records_count}</td>
                    <td style={{ padding: '12px' }}>{r.tier_badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Points Rules</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {rules.map((rule, idx) => (
              <div key={idx} style={{ background: 'rgba(255,85,0,0.1)', border: '1px solid rgba(255,85,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                {editingRule === rule.rule_name ? (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Points Value</label>
                      <input
                        type="number"
                        value={editingRuleValues[rule.rule_name]?.points_value || rule.points_value}
                        onChange={(e) => setEditingRuleValues({
                          ...editingRuleValues,
                          [rule.rule_name]: { ...editingRuleValues[rule.rule_name], points_value: parseInt(e.target.value) }
                        })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px', borderRadius: '4px', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Description</label>
                      <input
                        type="text"
                        value={editingRuleValues[rule.rule_name]?.description || rule.description}
                        onChange={(e) => setEditingRuleValues({
                          ...editingRuleValues,
                          [rule.rule_name]: { ...editingRuleValues[rule.rule_name], description: e.target.value }
                        })}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px', borderRadius: '4px', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleUpdateRule(rule.rule_name)} style={{ flex: 1, background: '#4ade80', border: 'none', color: 'black', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                        <Save size={16} style={{ marginRight: '4px' }} /> Save
                      </button>
                      <button onClick={() => setEditingRule(null)} style={{ flex: 1, background: '#888', border: 'none', color: 'white', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                        <X size={16} style={{ marginRight: '4px' }} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 style={{ margin: '0 0 8px 0', color: '#FF5500', fontWeight: '700' }}>{rule.rule_name}</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#888' }}>{rule.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '950', color: '#FFD700' }}>{rule.points_value}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>points</div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingRule(rule.rule_name);
                        setEditingRuleValues({ ...editingRuleValues, [rule.rule_name]: { points_value: rule.points_value, description: rule.description } });
                      }}
                      style={{ width: '100%', background: '#FF5500', border: 'none', color: 'white', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                    >
                      <Edit2 size={16} style={{ marginRight: '4px' }} /> Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust Points Tab */}
      {activeTab === 'adjust' && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '20px' }}>Manual Point Adjustment</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '700' }}>Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px' }}
            >
              <option value="">Choose a user...</option>
              {rankings.map((r, idx) => (
                <option key={idx} value={r.user_id}>{r.users?.display_name || r.users?.username}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '700' }}>Points to Adjust</label>
            <input
              type="number"
              value={pointsAdjustment}
              onChange={(e) => setPointsAdjustment(e.target.value)}
              placeholder="e.g., +50 or -20"
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '700' }}>Reason</label>
            <input
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g., Bonus for participation"
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: '700' }}>Admin Notes</label>
            <textarea
              value={adjustNotes}
              onChange={(e) => setAdjustNotes(e.target.value)}
              placeholder="Additional notes..."
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit' }}
            />
          </div>

          <button
            onClick={handleAdjustPoints}
            style={{ width: '100%', background: '#FF5500', border: 'none', color: 'white', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
          >
            Adjust Points
          </button>
        </div>
      )}
    </div>
  );
}
