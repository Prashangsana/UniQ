import React from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupDetailsView = ({ group, onBack, onViewProfile }) => {
  
  const handleLeaveGroup = () => {
    // Backend logic will go here
    if(window.confirm(`Are you sure you want to leave ${group.id}?`)) {
      console.log('Left group');
      onBack();
    }
  };

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>

        <div className="gf-header">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div>
              <h1 style={{margin:0, fontSize:'2.5rem', color:'#1e293b'}}>{group.id}</h1>
              <p style={{fontSize:'1.1rem'}}>
                <span style={{fontWeight:'600', color:'#5b7cbd'}}>{group.moduleId}</span> 
                {' '}— {group.domain} Domain
              </p>
            </div>
            {group.joined && (
               <button 
                className="gf-btn-danger" 
                style={{width:'auto', padding:'0.5rem 1.2rem'}}
                onClick={handleLeaveGroup}
               >
                 Leave Group
               </button>
            )}
          </div>
        </div>

        <h3 className="gf-section-title">Members ({group.members}/{group.maxMembers})</h3>

        <div className="gf-grid">
          {group.membersList.map((member, index) => (
            <div 
              key={index} 
              className="gf-card-simple"
              onClick={() => onViewProfile(member)} // Clickable Member
            >
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#cbd5e1'}}></div>
                <div>
                  <strong style={{display:'block'}}>{member.name}</strong>
                  <small style={{color:'#64748b'}}>{member.role}</small>
                </div>
              </div>
              <div>
                {member.skills.map(skill => (
                  <span key={skill} className="gf-skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Vacancy placeholders */}
          {[...Array(group.maxMembers - group.members)].map((_, i) => (
            <div key={`vac-${i}`} className="gf-card-simple" style={{borderStyle:'dashed', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>
              Empty Spot
            </div>
          ))}
        </div>
      </div>

      {group.joined && (
        <GroupsSidebar 
          type="group" 
          groupId={group.id} 
          onViewProfile={onViewProfile}
        />
      )}
    </div>
  );
};

export default GroupDetailsView;