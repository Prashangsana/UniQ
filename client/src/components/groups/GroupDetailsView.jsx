import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupDetailsView = ({ group: initialGroupData, onBack, onViewProfile, onFindMembers, onFinalise }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  // MATCH THIS TO IMASHA'S ID
  const CURRENT_USER_ID = "user_id_student_1"; 

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
          onBack(); 
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        alert("Failed to leave group. Is the server running?");
      }
    }
  };

  const handleRequestJoin = async () => {
    setRequesting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${group._id}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(data.message);
    } catch(e) {
      alert("Server error");
    } finally {
      setRequesting(false);
    }
  }

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${initialGroupData._id}`);
        const data = await response.json();
        if (data.success) {
          setGroup(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if(initialGroupData && initialGroupData._id) fetchGroupDetails();
  }, [initialGroupData]);

  if (loading || !group) return <div className="gf-main" style={{padding: '3rem', textAlign: 'center'}}>Loading group details...</div>;

  // SMART MEMBERSHIP CHECK
  const isMember = group.members.some(m => (m._id || m) === CURRENT_USER_ID);
  const isLeader = group.leader && (group.leader._id === CURRENT_USER_ID || group.leader === CURRENT_USER_ID);

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>
        <div className="gf-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <h2>{group.name}</h2>
            <p>{group.domain} • {group.members.length}/{group.maxMembers} Members</p>
          </div>
          <div>
            {isMember ? (
              <div style={{display:'flex', gap:'10px'}}>
                <button className="gf-btn-outline" style={{color: '#ef4444', borderColor: '#ef4444'}} onClick={handleLeaveGroup}>Leave Group</button>
                {/* Once the group is full, the leader can submit it! */}
                {isLeader && group.members.length === group.maxMembers && (
                   <button className="gf-btn-primary" onClick={() => onFinalise(group)}>Submit for Finalisation</button>
                )}
              </div>
            ) : (
              <button className="gf-btn-primary" onClick={handleRequestJoin} disabled={requesting}>
                {requesting ? 'Sending...' : 'Request to Join'}
              </button>
            )}
          </div>
        </div>

        <h3 className="gf-section-title">Members</h3>
        <div className="gf-grid">
          {group.members.map(member => (
            <div key={member._id} className="gf-card-simple" onClick={() => onViewProfile(member)}>
              <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#cbd5e1'}}></div>
                <div>
                  <strong style={{display:'block'}}>{member.name}</strong>
                  <small style={{color:'#64748b'}}>{member._id === (group.leader._id || group.leader) ? 'Leader' : 'Member'}</small>
                </div>
              </div>
              <div>
                {(member.skills || ['Student']).map(skill => (
                  <span key={skill} className="gf-skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Vacant slots logic */}
          {[...Array(Math.max(0, group.maxMembers - group.members.length))].map((_, i) => (
            <div 
              key={`vac-${i}`} 
              className="gf-card-simple" 
              style={{borderStyle:'dashed', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', cursor: isMember ? 'pointer' : 'default'}} 
              onClick={() => isMember && onFindMembers(group.moduleId, group._id)}
            >
              {isMember ? '+ Find Member' : 'Empty Spot'}
            </div>
          ))}
        </div>
      </div>

      {isMember && (
        <GroupsSidebar type="group" groupId={group._id} onViewProfile={onViewProfile} />
      )}
    </div>
  );
};

export default GroupDetailsView;