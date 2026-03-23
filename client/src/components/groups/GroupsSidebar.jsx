import React, { useState, useEffect } from 'react';
import './groups.css';
import { deadlines } from '../../data/mockGroups';

const GroupsSidebar = ({ type, invites, groupId, moduleId, onSelectInvite, onViewProfile }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real requests when the sidebar mounts for a group
  useEffect(() => {
    if (type === 'group' && groupId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/requests/groups/${groupId}/requests`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setRequests(data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch requests", err);
          setLoading(false);
        });
    }
    if (type === 'module' && moduleId) {
        setLoading(true);
        // Fetch students who have posted "looking for group" requests for this module
        fetch(`http://localhost:5000/api/groups/modules/${moduleId}/available-students`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            if (data.success) setRequests(data.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
    }
  }, [type, groupId, moduleId]);

  return (
    <aside className="gf-sidebar">
      
      {/* Dashboard View: Show Invites */}
      {type === 'dashboard' && (
        <>
          <h4>Group Invites</h4>
          {invites.length === 0 ? <p style={{color:'#94a3b8'}}>No new invites</p> : 
            invites.map((invite, i) => (
              <div 
                key={i} 
                className="gf-request-item"
                onClick={() => onSelectInvite(invite)} /* Clickable Invite */
              >
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <strong>{invite.group?.name || "Unknown Group"}</strong>
                  <small style={{color:'#5b7cbd'}}>View Details &rarr;</small>
                </div>
                <div style={{fontSize:'0.85rem', color:'#64748b', marginTop:'4px'}}>
                  {invite.group?.domain} • {invite.group?.members?.length} members
                </div>
              </div>
            ))
          }
        </>
      )}

      {/* Group View: Show Join Requests */}
      {type === 'group' && (
        <>
          <h4>Join Requests</h4>
          {loading ? <p style={{color:'#94a3b8'}}>Loading requests...</p> : 
           requests.length === 0 ?
            <p style={{color:'#94a3b8'}}>No active requests</p> :
            requests.map((r) => (
                <div 
                  key={r._id} 
                  className="gf-request-item"
                  // Package the requester data AND the requestId together
                  onClick={() => onViewProfile({ ...r.requester, requestId: r._id, isJoinRequest: true })} 
                >
                   <div style={{display:'flex', justifyContent:'space-between'}}>
                    <strong>{r.requester.name}</strong>
                    <small style={{color:'#5b7cbd'}}>Review</small>
                  </div>
                  <div>
                    {/* Fallback in case mock user lacks skills array */}
                    {(r.requester.skills || ['Student']).map(skill => (
                      <span key={skill} className="gf-skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              ))
          }
        </>
      )}

      <h4 style={{ marginTop: '2rem' }}>Upcoming Deadlines</h4>
      {deadlines.map((d, i) => (
        <div key={i} style={{marginBottom:'1rem', borderLeft:'3px solid #ef4444', paddingLeft:'10px'}}>
          <strong style={{display:'block', fontSize:'0.9rem'}}>{d.title}</strong>
          <small style={{color:'#64748b'}}>{d.date}</small>
        </div>
      ))}
    </aside>
  );
};

export default GroupsSidebar;