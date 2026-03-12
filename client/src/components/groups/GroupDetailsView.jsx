import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupDetailsView = ({ group: initialGroupData, onBack, onViewProfile, onFindMembers }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const handleLeaveGroup = async () => {
    if(window.confirm(`Are you sure you want to leave ${group.name}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${group._id}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success) {
          alert(data.message);
          onBack(); // Send user back to the dashboard/module view
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        alert("Failed to leave group. Is the server running?");
      }
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

  const handleRequestJoin = async () => {
    setRequesting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${group._id}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Request sent successfully! Waiting for group approval.");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Failed to send request. Is the server running?");
    } finally {
      setRequesting(false);
    }
  };

  if (loading || !group) return <div className="gf-main">Loading details...</div>;

  const CURRENT_USER_ID = "60d0fe4f5311236168a109ca"; // Mock user ID
  const isMember = group.members.some(member => member._id === CURRENT_USER_ID);

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

            <div style={{display: 'flex', gap: '10px'}}>
              {/* Find Members Button (Only show if in group and group isn't full) */}
              {isMember && group.members.length < group.maxMembers && (
                <button 
                  className="gf-btn-outline" 
                  onClick={() => onFindMembers(group.moduleId, group._id)} 
                  style={{width:'auto', padding:'0.5rem 1.2rem'}}
                >
                  Find Members
                </button>
              )}

              {isMember ? (
                <button className="gf-btn-danger" onClick={handleLeaveGroup} style={{width:'auto', padding:'0.5rem 1.2rem'}}>
                  Leave Group
                </button>
              ) : (
                <button 
                  className="gf-btn-primary" 
                  onClick={handleRequestJoin} 
                  disabled={requesting || group.members.length >= group.maxMembers}
                  style={{width:'auto', padding:'0.5rem 1.2rem', opacity: (requesting || group.members.length >= group.maxMembers) ? 0.5 : 1}}
                >
                  {requesting ? 'Sending...' : group.members.length >= group.maxMembers ? 'Group Full' : 'Request to Join'}
                </button>
              )}
            </div>
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

      {isMember && (
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