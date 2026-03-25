import React, { useState } from 'react';
import './groups.css';

const UserProfileView = ({ user, type, onBack }) => {
  // 'type' can be 'member' or 'requester' to determine buttons
  const [processing, setProcessing] = useState(false);

  const handleRequestAction = async (action) => {
    try {
      // action will be either 'approve' or 'reject'
      const response = await fetch(`http://localhost:5000/api/requests/requests/${user.requestId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Check your backend console.");
      }
      
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        onBack(); // Send them back to the group view so the sidebar reloads
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Server error. Make sure your backend is running.");
    }
  };

  // Handler for sending an outbound invite to a student
  const handleSendInvite = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/invites/groups/${user.targetGroupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ invitedUserId: user._id }) // Match your controller's req.body.invitedUserId
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Invite sent successfully!");
        onBack(); // Return to the roster
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Server error. Make sure your backend is running.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
      <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>
      
      <div className="gf-card-simple" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#5b7cbd' }}></div>
          <div>
            <h2 style={{ margin: 0 }}>{user.name || user.student}</h2>
            <p style={{ margin: '5px 0 0', color: '#64748b' }}>Computer Science Undergraduate</p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4>Skills</h4>
          <div>
            {user.skills && user.skills.map(skill => (
              <span key={skill} className="gf-skill-chip">{skill}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4>Bio</h4>
          <p style={{ lineHeight: '1.6', color: '#334155' }}>
            {user.bio || "No bio available."}
          </p>
        </div>

        {/* Logic for Join Request Actions */}
        {user.isJoinRequest && (
           <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
             <button 
               className="gf-btn-outline" 
               style={{flex:1}} 
               onClick={() => handleRequestAction('reject')}
             >
               Deny Request
             </button>
             <button 
               className="gf-btn-primary" 
               style={{flex:1}} 
               onClick={() => handleRequestAction('approve')}
             >
               Accept to Group
             </button>
           </div>
        )}

        {/* Logic for Outbound Invites from Roster */}
        {user.isRosterView && (
           // --- Changed to flex-direction: 'column' to stack the buttons ---
           <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button 
               className="gf-btn-primary" 
               style={{width: '100%'}} 
               onClick={handleSendInvite}
               disabled={processing}
             >
               {processing ? 'Sending Invite...' : 'Send Invite'}
             </button>

             <button 
               className="gf-btn-outline" 
               style={{width: '100%'}} 
               onClick={() => {
                 // TODO: Teammate Integration
                 // Replace this alert with your routing logic when profile is done.
                 // Example: window.location.href = `/profile/${user._id}`;
                 // Or if using React Router: navigate(`/profile/${user._id}`);
                 alert(`Navigating to Full Public Profile for ${user.name}... (Teammate's component goes here!)`);
               }}
             >
               View Full Profile
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;