import React, { useState } from 'react';
import './groups.css';

const domains = ['Machine Learning', 'Web Development', 'Mobile App', 'Cyber Security', 'UI/UX Design', 'Data Science'];

const CreateGroupView = ({ module, onBack, onSuccess }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [maxMembers, setMaxMembers] = useState(5); // Added maxMembers state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || !selectedDomain) return alert("Please fill all fields");
    
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/groups/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: groupName,
          moduleId: module._id,
          domain: selectedDomain
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Success! Group "${groupName}" created!`);
        if (onSuccess) onSuccess();
        else onBack(); // Go back to the module view to see the new group
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Server error. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '1rem' }}>
      <button className="gf-btn-back" onClick={onBack}>&larr; Cancel</button>
      
      <div className="gf-card-simple" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Start a New Group</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Module: {module._id}</p>

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