import React, { useState, useEffect } from 'react';
import './groups.css';
import FullProfileWrapper from './FullProfileWrapper';

const UserProfileView = ({ user: initialUser, type, onBack }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [user, setUser] = useState(initialUser);
  // 'type' can be 'member' or 'requester' to determine buttons
  const [processing, setProcessing] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);

  useEffect(() => {
    const fetchFullUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/public-profile/${initialUser._id || initialUser.id}`);
        const result = await response.json();
        if (result.success) {
          // Merge the existing data (like requestId) with the new profile data
          setUser(prev => ({ ...prev, ...result.data }));
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };
    fetchFullUser();
  }, [initialUser, API_URL]);

  const userAvatar = user.profileImage || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.student}`;

  const handleRequestAction = async (action) => {
    try {
      // action will be either 'approve' or 'reject'
      const response = await fetch(`${API_URL}/api/requests/requests/${user.requestId}/${action}`, {
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
      const response = await fetch(`${API_URL}/api/invites/groups/${user.targetGroupId}/invite`, {
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

  if (showFullProfile) {
    return (
      <FullProfileWrapper
        user={user}
        onBack={() => setShowFullProfile(false)}
        onInvite={user.hideInvite ? null : handleSendInvite}
        onAccept={() => handleRequestAction('approve')}
        onDeny={() => handleRequestAction('reject')}
        processing={processing}
        hideInvite={user.hideInvite}
      />
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
      <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>

      <div className="gf-card-simple" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <img
            src={userAvatar}
            alt="Profile"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{user.name || user.student}</h2>

            <p style={{ margin: '5px 0 0', color: '#64748b' }}>
              {user.role === 'lecturer'
                ? (user.education || user.department || 'Lecturer')
                : (user.course || 'Undergraduate Student')}
            </p>
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
              style={{ flex: 1 }}
              onClick={() => handleRequestAction('reject')}
            >
              Deny Request
            </button>
            <button
              className="gf-btn-primary"
              style={{ flex: 1 }}
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
            {!user.hideInvite && (
              <button
                className="gf-btn-primary"
                style={{ width: '100%' }}
                onClick={handleSendInvite}
                disabled={processing}
              >
                {processing ? 'Sending Invite...' : 'Send Invite'}
              </button>
            )}

            <button
              className="gf-btn-outline"
              style={{ width: '100%' }}
              onClick={() => setShowFullProfile(true)} // Toggle the new view
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