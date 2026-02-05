import React from 'react';
import './groups.css';
import { groupJoinRequests, deadlines } from '../../data/mockGroups';

const GroupsSidebar = ({ type, invites, groupId, onSelectInvite, onViewProfile }) => {
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
                  <strong>{invite.groupId}</strong>
                  <small style={{color:'#5b7cbd'}}>View Details &rarr;</small>
                </div>
                <div style={{fontSize:'0.85rem', color:'#64748b', marginTop:'4px'}}>
                  {invite.domain} • {invite.members} members
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
          {groupJoinRequests.filter(r => r.groupId === groupId).length === 0 ? 
            <p style={{color:'#94a3b8'}}>No active requests</p> :
            groupJoinRequests
              .filter(r => r.groupId === groupId)
              .map((r, i) => (
                <div 
                  key={i} 
                  className="gf-request-item"
                  onClick={() => onViewProfile(r)} /* Clickable Profile */
                >
                   <div style={{display:'flex', justifyContent:'space-between'}}>
                    <strong>{r.student}</strong>
                    <small style={{color:'#5b7cbd'}}>Review</small>
                  </div>
                  <div>
                    {r.skills.map(skill => (
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