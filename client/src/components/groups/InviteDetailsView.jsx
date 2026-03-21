import React, { useState } from 'react';
import './groups.css';

const InviteDetailsView = ({ invite, onBack }) => {
  const [loading, setLoading] = useState(false);

  // Generic handler for both Accept and Reject actions
  const handleInviteAction = async (action) => {
    setLoading(true);
    try {
      // Action will be either 'accept' or 'reject'
      const response = await fetch(`http://localhost:5000/api/invites/${invite._id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Success: ${data.message}`);
        onBack(); // Send the user back to the dashboard so it refreshes
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} invite:`, error);
      alert("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

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
          <button className="gf-btn-outline" onClick={() => handleInviteAction('reject')} disabled={loading}>Deny</button>
          <button className="gf-btn-primary" onClick={() => handleInviteAction('accept')} disabled={loading}>{loading ? 'Processing...' : 'Accept Invitation'}</button>
        </div>
      </div>
    </div>
  );
};

export default InviteDetailsView;