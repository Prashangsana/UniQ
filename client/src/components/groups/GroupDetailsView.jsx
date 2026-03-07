import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupDetailsView = ({ group: initialGroupData, onBack, onViewProfile }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLeaveGroup = () => {
    if(window.confirm(`Are you sure you want to leave ${group.name}?`)) {
      console.log('Left group');
      onBack();
    }
  };

  // Fetch full details with populated members when clicked
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${initialGroupData._id}`);
        const data = await response.json();
        
        if (data.success) {
          setGroup(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch group details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (initialGroupData && initialGroupData._id) {
      fetchGroupDetails();
    }
  }, [initialGroupData]);

  if (loading || !group) return <div className="gf-main">Loading details...</div>;

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>

        <div className="gf-header">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
            <div>
              <h1 style={{margin:0, fontSize:'2.5rem', color:'#1e293b'}}>{group.name}</h1>
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

        <h3 className="gf-section-title">Members ({group.members.length}/{group.maxMembers})</h3>

        <div className="gf-grid">
          {/* Display actual fetched members */}
          {group.members.map((member, index) => (
            <div 
              key={member._id || index} 
              className="gf-card-simple"
              onClick={() => onViewProfile(member)} // Clickable Member
            >
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#cbd5e1'}}></div>
                <div>
                  <strong style={{display:'block'}}>{member.name}</strong>
                  <small style={{color:'#64748b'}}>{member._id === group.leader._id ? 'Leader' : 'Member'}</small>
                </div>
              </div>
              <div>
                {/* Fallback if skills don't exist yet on mock user */}
                {(member.skills || ['Student']).map(skill => (
                  <span key={skill} className="gf-skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Vacancy placeholders */}
          {[...Array(group.maxMembers - group.members.length)].map((_, i) => (
            <div key={`vac-${i}`} className="gf-card-simple" style={{borderStyle:'dashed', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8'}}>
              Empty Spot
            </div>
          ))}
        </div>
      </div>

      {group.joined && (
        <GroupsSidebar 
          type="group" 
          groupId={group._id} 
          onViewProfile={onViewProfile}
        />
      )}
    </div>
  );
};

export default GroupDetailsView;