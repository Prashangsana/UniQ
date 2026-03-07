import React, { useState, useEffect } from 'react';
import './groups.css';

const ModuleGroupsView = ({ module, onBack, onSelectGroup, onCreateGroup }) => {
  const [moduleGroups, setModuleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Temporary hardcoded logic until further backend implementation: Assume user is NOT in a group 
  // (In a real app, the backend would tell us if the logged-in user is in one of these groups)
  const isAlreadyInGroup = false; 

  // Fetch groups from backend when the module view opens
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/modules/${module.id}/groups`);
        const data = await response.json();
        
        if (data.success) {
          setModuleGroups(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [module.id]);

  if (loading) return <div className="gf-main" style={{textAlign: 'center', padding: '3rem'}}>Loading groups...</div>;

  return (
    <div className="gf-main">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button className="gf-btn-back" onClick={onBack}>&larr; Back to Modules</button>

        <div className="gf-header">
          <h2>{module.id} Groups</h2>
          <p>Showing all available project groups for {module.name}</p>
        </div>
        
        {/* Only show Create button if user is NOT in a group for this module */}
        {!isAlreadyInGroup && (
          <button className="gf-btn-primary" style={{width:'auto'}} onClick={onCreateGroup}>
            + Create New Group
          </button>
        )}
      </div>

      {moduleGroups.length === 0 ? (
        <div className="gf-card-simple" style={{textAlign: 'center', padding: '3rem'}}>
          <p style={{color: '#64748b'}}>No groups have been created for this module yet.</p>
          <button className="gf-btn-primary" style={{width: 'auto'}} onClick={onCreateGroup}>
            + Create First Group
          </button>
        </div>
      ) : (
        <div className="gf-grid">
          {moduleGroups.map(group => (
            <div 
              key={group._id} 
              className="gf-card-visual"
              onClick={() => onSelectGroup(group)}
            >
              {/* Use group image or a fallback */}
              <img src={group.img || `https://via.placeholder.com/300x200?text=${group.name}`} alt={group.name} />
              
              <div className="gf-card-gradient">
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  {group.joined ? (
                    <span className="gf-badge-joined">Your Group</span>
                  ) : (
                    <span className="gf-badge-open">Open</span>
                  )}
                </div>

                <div className="gf-card-title">{group.name}</div>
                <div className="gf-card-sub">
                  {group.memberCount}/{group.maxMembers} Members • {group.domain}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModuleGroupsView;