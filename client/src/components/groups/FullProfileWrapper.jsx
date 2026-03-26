import React from 'react';
import PublicProfile from '../../components/Landing/PublicProfile';
import { useParams } from 'react-router-dom';

const FullProfileWrapper = ({ user, onBack, onInvite, onAccept, onDeny, processing }) => {
  return (
    <div className="full-profile-wrapper">
      {/* Top Navigation Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        background: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button className="gf-btn-back" onClick={onBack}>&larr; Back to Groups</button>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Show Invite Button if in Roster View */}
          {user.isRosterView && (
            <button 
              className="gf-btn-primary" 
              onClick={onInvite} 
              disabled={processing}
            >
              {processing ? 'Sending...' : 'Invite to Group'}
            </button>
          )}

          {/* Show Accept/Deny if it's a Request */}
          {user.isJoinRequest && (
            <>
              <button className="gf-btn-outline" onClick={onDeny}>Deny</button>
              <button className="gf-btn-primary" onClick={onAccept}>Accept</button>
            </>
          )}
        </div>
      </div>

      {/* The Teammate's Component */}
      <div style={{ marginTop: '1rem' }}>
        <PublicProfile id={user._id || user.id} />
      </div>
    </div>
  );
};

export default FullProfileWrapper;