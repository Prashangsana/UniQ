import React, { useState } from 'react';
import './groups.css';

const domains = ['Machine Learning', 'Web Development', 'Mobile App', 'Cyber Security', 'UI/UX Design', 'Data Science'];

const CreateGroupView = ({ module, onBack }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName || !selectedDomain) return alert("Please fill all fields");
    
    // Backend implementation later
    alert(`Success! Group "${groupName}" created for ${module.id} in ${selectedDomain}`);
    onBack();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '1rem' }}>
      <button className="gf-btn-back" onClick={onBack}>&larr; Cancel</button>
      
      <div className="gf-card-simple" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Start a New Group</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Module: {module.id}</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Group Name / ID</label>
            <input 
              type="text" 
              className="gf-input" 
              placeholder="e.g. CS-105 or TechTitans"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>Project Domain</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {domains.map(domain => (
                <button
                  key={domain}
                  type="button"
                  className={`gf-tag-btn ${selectedDomain === domain ? 'active' : ''}`}
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="gf-btn-primary" style={{ padding: '1rem' }}>
            Create Group & Invite Members
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupView;