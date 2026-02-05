import React from 'react';
import './groups.css';

const InviteDetailsView = ({ invite, onBack }) => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
      <button className="gf-btn-back" onClick={onBack}>&larr; Back to Dashboard</button>
      
      <div className="gf-card-simple" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Invitation from {invite.groupId}</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Module: {invite.moduleId}</p>
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <p style={{ fontStyle: 'italic', color: '#475569' }}>"{invite.message}"</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="gf-btn-outline" onClick={onBack}>Deny</button>
          <button className="gf-btn-primary" onClick={() => alert('Accepted! Backend logic here.')}>Accept Invitation</button>
        </div>
      </div>
    </div>
  );
};

export default InviteDetailsView;