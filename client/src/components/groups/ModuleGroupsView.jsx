import React, { useState, useEffect } from 'react';
import './groups.css';

const ModuleGroupsView = ({ module, onBack, onSelectGroup, onCreateGroup, currentUser }) => {
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
          setModuleGroups(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (module && module._id) {
      fetchGroups();
    } else {
      setLoading(false); // Failsafe
    }
  }, [module]);

  if (loading) return <div className="gf-main" style={{textAlign: 'center', padding: '3rem'}}>Loading groups...</div>;

  // SAFEGUARD: Prevents the blank page crash!
  if (!module) return <div className="gf-main">Error: Module not found <button onClick={onBack}>Go Back</button></div>;

  // Smart check to see if you are already in a group here
  const isAlreadyInGroup = moduleGroups.some(g => 
    g.members && g.members.some(m => (m._id || m) === currentUser?._id)
  );

  return (
    <div className="gf-main">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button className="gf-btn-back" onClick={onBack}>&larr; Back to Modules</button>

        <div className="gf-header">
          <h2>{module._id} Groups</h2>
          <p>Showing all available project groups for {module.name}</p>
        </div>
        
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
          {moduleGroups.map(group => {
            if (!group) return null; // Failsafe
            
            // Checks if Imasha is in this specific card
            const isMyGroup = group.members && group.members.some(m => (m._id || m) === currentUser?._id);

            return (
              <div 
                key={group._id} 
                className="gf-card-visual"
                onClick={() => onSelectGroup(group)}
              >
                <img src={group.img || `https://via.placeholder.com/300x200?text=${group.name}`} alt={group.name} />
                
                <div className="gf-card-gradient">
                  <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                    {isMyGroup ? (
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleGroupsView;