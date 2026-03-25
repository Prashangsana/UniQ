import React, { useState, useEffect } from 'react';
import './groups.css';
import { deadlines as mockDeadlines } from '../../data/mockGroups';

const GroupsSidebar = ({ type, invites, groupId, moduleId, onSelectInvite, onViewProfile, deadlines }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for editable deadlines (used in Group View)
  const [isEditingDeadlines, setIsEditingDeadlines] = useState(false);
  const [localDeadlines, setLocalDeadlines] = useState(deadlines || mockDeadlines || []);

  // 1. Fetch Data based on Context
  useEffect(() => {
    // If we are in a Group or a Module, we look for join requests 
    // (Someone wanting to join the user's current group)
    if ((type === 'group' || type === 'module') && groupId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/requests/groups/${groupId}/requests`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setRequests(data.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [type, groupId]);

  useEffect(() => {
    // Sync localDeadlines whenever the parent 'deadlines' prop changes
    if (deadlines) {
      setLocalDeadlines(deadlines);
    }
  }, [deadlines]);

  const handleSaveDeadlines = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/groups/groups/${groupId}/deadlines`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deadlines: localDeadlines })
      });
      if (res.ok) setIsEditingDeadlines(false);
    } catch (err) { console.error("Update failed", err); }
  };

  const addNewDeadline = () => {
    setLocalDeadlines([...localDeadlines, { title: 'New Task', date: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <aside className="gf-sidebar">

      {/* --- SECTION 1: INVITES & REQUESTS --- */}

      {/* DASHBOARD: Show all Invites */}
      {type === 'dashboard' && (
        <>
          <h4>Group Invites</h4>
          {invites.length === 0 ? <p className="gf-empty-text">No new invites</p> :
            invites.map((invite, i) => (
              <div key={i} className="gf-request-item" onClick={() => onSelectInvite(invite)}>
                <strong>{invite.group?.name}</strong>
                <div className="gf-item-sub">{invite.group?.domain}</div>
              </div>
            ))
          }
        </>
      )}

      {/* MODULE VIEW: Show Join Requests (to your group) AND Invites (from other groups in this module) */}
      {type === 'module' && (
        <>
          <h4>Join Requests</h4>
          {requests.length === 0 ? <p className="gf-empty-text">No join requests</p> :
            requests.map(r => (
              <div key={r._id} className="gf-request-item" onClick={() => onViewProfile({ ...r.requester, requestId: r._id, isJoinRequest: true })}>
                <strong>{r.requester.name} wants to join</strong>
              </div>
            ))
          }

          <h4 style={{ marginTop: '1.5rem' }}>Group Invites</h4>
          {invites.filter(inv => inv.group?.moduleId === moduleId).length === 0 ?
            <p className="gf-empty-text">No invites for this module</p> :
            invites.filter(inv => inv.group?.moduleId === moduleId).map((invite, i) => (
              <div key={i} className="gf-request-item" onClick={() => onSelectInvite(invite)}>
                <strong>Invite from {invite.group?.name}</strong>
              </div>
            ))
          }
        </>
      )}

      {/* GROUP VIEW: Show only Join Requests for this specific group */}
      {type === 'group' && (
        <>
          <h4>Join Requests</h4>
          {loading ? <p>Loading...</p> : requests.length === 0 ? <p className="gf-empty-text">No active requests</p> :
            requests.map(r => (
              <div key={r._id} className="gf-request-item" onClick={() => onViewProfile({ ...r.requester, requestId: r._id, isJoinRequest: true })}>
                <strong>{r.requester.name}</strong>
                <small style={{ color: '#3b82f6', display: 'block' }}>Review Request</small>
              </div>
            ))
          }
        </>
      )}

      <hr style={{ margin: '2rem 0', opacity: 0.1 }} />

      {/* --- SECTION 2: DEADLINES --- */}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4>Upcoming Deadlines</h4>
        {type === 'group' && !isEditingDeadlines && (
          <button onClick={() => setIsEditingDeadlines(true)} className="gf-edit-link">Edit</button>
        )}
      </div>

      {isEditingDeadlines ? (
        <div className="gf-edit-deadlines-container">
          {localDeadlines.map((d, i) => (
            <div key={i} className="gf-edit-row">
              <button className="gf-delete-btn" onClick={() => setLocalDeadlines(localDeadlines.filter((_, idx) => idx !== i))}>✕</button>
              <input value={d.title} onChange={(e) => {
                const newD = [...localDeadlines]; newD[i].title = e.target.value; setLocalDeadlines(newD);
              }} />
              <input type="date" value={d.date} onChange={(e) => {
                const newD = [...localDeadlines]; newD[i].date = e.target.value; setLocalDeadlines(newD);
              }} />
            </div>
          ))}
          <button onClick={addNewDeadline} className="gf-btn-outline" style={{ width: '100%', marginBottom: '5px' }}>+ Add Row</button>
          <button onClick={handleSaveDeadlines} className="gf-btn-primary" style={{ width: '100%' }}>Save All</button>
        </div>
      ) : (
        localDeadlines
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((d, i) => (
            <div key={i} className="gf-deadline-item">
              <strong>{d.title}</strong>
              {d.groupName && <small style={{display: 'block', color: '#3b82f6'}}>{d.groupName}</small>}
              <small>{new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small>
            </div>
          ))
      )}
    </aside>
  );
};

export default GroupsSidebar;