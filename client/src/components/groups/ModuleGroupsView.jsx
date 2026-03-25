import React, { useState, useEffect } from 'react';
import './groups.css';

const ModuleGroupsView = ({ module, onBack, onSelectGroup, onCreateGroup }) => {
  const [moduleGroups, setModuleGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/modules/${module._id}/groups`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setModuleGroups(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch module groups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (module && module._id) {
      fetchGroups();
    }
  }, [module]);

  if (loading) {
    return (
      <div className="module-groups-view">
        <div className="module-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>{module?.name || 'Module'}</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading groups...
        </div>
      </div>
    );
  }

  return (
    <div className="module-groups-view">
      <div className="module-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>{module?.name || 'Module'}</h2>
        <button 
          className="create-group-btn"
          onClick={() => onCreateGroup && onCreateGroup(module)}
        >
          + Create Group
        </button>
      </div>

      <div className="module-stats">
        <div className="stat-item">
          <h3>{moduleGroups.length}</h3>
          <p>Total Groups</p>
        </div>
        <div className="stat-item">
          <h3>{moduleGroups.filter(g => g.isOpen).length}</h3>
          <p>Open Groups</p>
        </div>
      </div>

      <div className="groups-list">
        {moduleGroups.length === 0 ? (
          <div className="empty-state">
            <p>No groups found for this module</p>
            <button 
              className="create-first-group-btn"
              onClick={() => onCreateGroup && onCreateGroup(module)}
            >
              Create the first group
            </button>
          </div>
        ) : (
          moduleGroups.map(group => (
            <div 
              key={group._id} 
              className={`group-item ${group.joined ? 'joined' : ''}`}
              onClick={() => onSelectGroup && onSelectGroup(group)}
            >
              <div className="group-info">
                <h4>{group.name}</h4>
                <p>{group.description}</p>
                <div className="group-meta">
                  <span>{group.members?.length || 0} members</span>
                  <span>{group.maxMembers || 'No'} max</span>
                  {group.isOpen ? (
                    <span className="status-open">Open</span>
                  ) : (
                    <span className="status-closed">Closed</span>
                  )}
                </div>
              </div>
              {group.joined && (
                <div className="joined-badge">
                  <span>✓ Joined</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleGroupsView;
