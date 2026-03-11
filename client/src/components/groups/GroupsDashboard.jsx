import React, { useState, useEffect } from 'react';
import './groups.css';
import { groups, modules } from '../../data/mockGroups';
import GroupsSidebar from './GroupsSidebar';

const GroupsDashboard = ({ onSelectModule, onSelectGroup, onSelectInvite }) => {
  const joinedGroups = groups.filter(g => g.joined);

  // State to hold our fetched invites
  const [invites, setInvites] = useState([]);

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

    fetchInvites();
  }, []);

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <div className="gf-header">
          <h2>My Groups</h2>
          <p>Manage your academic collaborations</p>
        </div>

        {/* Visual Cards Grid to match Main Dashboard */}
        <div className="gf-grid">
          {joinedGroups.map(group => (
            <div 
              key={group.id} 
              className="gf-card-visual"
              onClick={() => onSelectGroup(group)}
            >
              <img src={group.img} alt={group.id} />
              <div className="gf-card-gradient">
                <div className="gf-card-title">{group.id}</div>
                <div className="gf-card-sub">{group.domain}</div>
              </div>
            </div>
          ))}
        </div>

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