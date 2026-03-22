import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupsDashboard = ({ onSelectModule, onSelectGroup, onSelectInvite }) => {
  // State to hold our fetched invites
  const [invites, setInvites] = useState([]);

  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Dynamic Modules
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

  // Fetch pending invites when the dashboard loads
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/invites/my', {
          credentials: 'include'
        });
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
        const response = await fetch('http://localhost:5000/api/groups/my', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) setMyGroups(data.data);
      } catch (error) {
        console.error("Failed to fetch my groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    // Fetch only modules that have an Open Group Project
    const fetchOpenModules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/modules/open', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setModules(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch open modules:", error);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchInvites();
    fetchMyGroups();
    fetchOpenModules();
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

        {/* --- DYNAMIC MODULES SECTION --- */}
        <h3 className="gf-section-title">Explore Open Modules</h3>

        {loadingModules ? (
          <p style={{ color: '#64748b' }}>Loading open modules...</p>
        ) : modules.length === 0 ? (
          <div className="gf-card-simple" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
            <p>No lecturers have opened group projects yet.</p>
          </div>
        ) : (
          <div className="gf-grid">
            {modules.map(m => (
              <div 
                key={m._id} // Changed to _id
                className="gf-card-simple"
                onClick={() => onSelectModule(m)}
                style={{ cursor: 'pointer', transition: 'all 0.2s', borderTop: '4px solid #3b82f6' }} // Added styling
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{m.name}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '12px' }}>
                    {m._id}
                  </span>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Click to view groups or create your own.</p>
              </div>
            ))}
          </div>
        )}
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