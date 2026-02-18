import React from 'react';
import './groups.css';
import { groups } from '../../data/mockGroups';

const ModuleGroupsView = ({ module, onBack, onSelectGroup, onCreateGroup }) => {
  // Filter groups that belong to this specific module
  const moduleGroups = groups.filter(g => g.moduleId === module.id);

  // Check if the user is already in ANY group within this specific module
  const isAlreadyInGroup = moduleGroups.some(g => g.joined === true);

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
              key={group.id} 
              className="gf-card-visual"
              onClick={() => onSelectGroup(group)}
            >
              {/* Use group image or a fallback */}
              <img src={group.img || 'https://via.placeholder.com/300x200?text=Group'} alt={group.id} />
              
              <div className="gf-card-gradient">
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                  {group.joined ? (
                    <span className="gf-badge-joined">Your Group</span>
                  ) : (
                    <span className="gf-badge-open">Open</span>
                  )}
                </div>

                <div className="gf-card-title">{group.id}</div>
                <div className="gf-card-sub">
                  {group.members}/{group.maxMembers} Members • {group.domain}
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