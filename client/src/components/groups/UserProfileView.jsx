import React from 'react';
import './groups.css';

const UserProfileView = ({ user, type, onBack }) => {
  // 'type' can be 'member' or 'requester' to determine buttons

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
        {user.student && (
           <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
             <button className="gf-btn-outline" style={{flex:1}} onClick={onBack}>Deny Request</button>
             <button className="gf-btn-primary" style={{flex:1}} onClick={() => alert('Accepted student!')}>Accept to Group</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;