import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupsDashboard = ({ onSelectModule, onSelectGroup, onSelectInvite }) => {
  // State to hold our fetched invites
  const [invites, setInvites] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  const fetchMyGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups/my-groups', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setGroups(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const fetchOpenModules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/modules', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setModules(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
  };

  const fetchMyInvites = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invites/my-invites', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setInvites(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch invites:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMyGroups(),
        fetchOpenModules(),
        fetchMyInvites()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="gf-layout">
        <div className="gf-main">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading groups data...
          </div>
        </div>
      </div>
    );
  }

  const joinedGroups = groups.filter(g => g.joined);

  return (
    <div className="gf-layout">
      <div className="gf-main">
        {/* Header */}
        <div className="gf-header">
          <h1 className="gf-title">Groups</h1>
          <p className="gf-subtitle">Manage your group projects and collaborations</p>
        </div>

        {/* Quick Stats */}
        <div className="gf-stats">
          <div className="stat-card">
            <h3>{joinedGroups.length}</h3>
            <p>Joined Groups</p>
          </div>
          <div className="stat-card">
            <h3>{invites.length}</h3>
            <p>Pending Invites</p>
          </div>
          <div className="stat-card">
            <h3>{modules.length}</h3>
            <p>Available Modules</p>
          </div>
        </div>

        {/* Recent Groups */}
        <section className="gf-section">
          <h2 className="gf-section-title">Your Groups</h2>
          <div className="gf-grid">
            {joinedGroups.length === 0 ? (
              <div className="gf-empty">
                <p>No groups joined yet</p>
              </div>
            ) : (
              joinedGroups.slice(0, 6).map(group => (
                <div 
                  key={group._id} 
                  className="gf-card"
                  onClick={() => onSelectGroup && onSelectGroup(group)}
                >
                  <h4>{group.name}</h4>
                  <p>{group.description}</p>
                  <div className="gf-card-meta">
                    <span>{group.members?.length || 0} members</span>
                    <span>{group.module?.name || 'No module'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Available Modules */}
        <section className="gf-section">
          <h2 className="gf-section-title">Available Modules</h2>
          <div className="gf-grid">
            {modules.length === 0 ? (
              <div className="gf-empty">
                <p>No modules available</p>
              </div>
            ) : (
              modules.slice(0, 4).map(module => (
                <div 
                  key={module._id} 
                  className="gf-card"
                  onClick={() => onSelectModule && onSelectModule(module)}
                >
                  <h4>{module.name}</h4>
                  <p>{module.description}</p>
                  <div className="gf-card-meta">
                    <span>{module.code}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <GroupsSidebar 
        type="dashboard" 
        invites={invites}
        onSelectInvite={onSelectInvite}
      />
    </div>
  );
};

export default GroupsDashboard;
