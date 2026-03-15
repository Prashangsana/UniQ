import React, { useState, useEffect } from 'react';
import './groups.css';
import { groups, modules } from '../../data/mockGroups';
import GroupsSidebar from './GroupsSidebar';

const GroupsDashboard = ({ onSelectModule, onSelectGroup, onSelectInvite }) => {
  // State to hold our fetched invites
  const [invites, setInvites] = useState([]);

  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Fetch pending invites when the dashboard loads
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/invites/my');
        const data = await response.json();
        
        if (data.success) {
          setInvites(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch invites:", error);
      }
    };

    const fetchMyGroups = async () => {
      try {
        setLoadingGroups(true);
        const response = await fetch('http://localhost:5000/api/groups/my');
        const data = await response.json();
        if (data.success) setMyGroups(data.data);
      } catch (error) {
        console.error("Failed to fetch my groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchInvites();
    fetchMyGroups();
  }, []);

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <div className="gf-header">
          <h2>My Groups</h2>
          <p>Manage your academic collaborations</p>
        </div>

        {/* --- DYNAMIC GROUPS GRID WITH LOCKED STATE --- */}
        {loadingGroups ? (
          <div className="p-6 text-center text-gray-500 animate-pulse">Loading your groups...</div>
        ) : myGroups && myGroups.length > 0 ? (
          <div className="gf-grid">
            {myGroups.map(group => (
              <div 
                key={group._id} 
                className="gf-card-visual"
                onClick={() => onSelectGroup(group)}
              >
                {/* Fallback image if the backend doesn't provide one */}
                <img src={group.img || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60'} alt={group.name} />
                <div className="gf-card-gradient">
                  <div className="gf-card-title">{group.name}</div>
                  <div className="gf-card-sub">{group.domain}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LOCKED / EMPTY STATE UI (Fixed Size using Inline Styles) */
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            padding: '2rem',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '2rem auto',
            maxWidth: '400px'
          }}>
            <svg style={{ width: '40px', height: '40px', color: '#94a3b8', marginBottom: '10px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' }}>No Active Groups</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
              You are currently not assigned to any groups. Explore the modules below!
            </p>
          </div>
        )}

        <h3 className="gf-section-title">Explore Modules</h3>

        <div className="gf-grid">
          {modules.map(m => (
            <div 
              key={m.id} 
              className="gf-card-simple"
              onClick={() => onSelectModule(m)}
              style={{ minHeight: '100px', display: 'flex', alignItems: 'center' }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#334155' }}>{m.id}</h4>
                <small style={{ color: '#64748b' }}>{m.name.split('(')[0]}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GroupsSidebar 
        type="dashboard" 
        invites={invites} 
        onSelectInvite={onSelectInvite}
      />
    </div>
  );
};

export default GroupsDashboard;