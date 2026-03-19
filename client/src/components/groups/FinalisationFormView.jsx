import React, { useState } from 'react';
import './groups.css';

const FinalisationFormView = ({ group, onBack, onSubmit }) => {
  const allowedPrefixes = ["SE", "CS", "DS", "AI"]; 
  
  const [selectedPrefix, setSelectedPrefix] = useState(allowedPrefixes[0]);
  const [memberDetails, setMemberDetails] = useState(
    group?.members.map(m => ({ 
      id: m._id || m.id, 
      name: m.name, 
      iitId: m.iitId || '', // Might come from profile later
      uowId: m.uowId || '', // Might come from profile later
      phone: '', 
      tutorialGroup: '' 
    })) || []
  );

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...memberDetails];
    updatedDetails[index][field] = value;
    setMemberDetails(updatedDetails);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      selectedPrefix,
      formData: memberDetails
    };
    onSubmit(group._id || group.id, submissionData);
  };

  return (
    <div className="gf-main" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <button className="gf-btn-outline" onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to Group
      </button>

      <div className="gf-card-simple" style={{ padding: '2rem' }}>
        <h2>Finalise Group: {group?.name}</h2>
        <div style={{ background: '#fef3c7', color: '#b45309', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>⚠️ Warning:</strong> Once submitted, your group is locked for review. No members can leave or join unless the lecturer rejects the request.
        </div>

        <form onSubmit={handleSubmit}>
          {/* PREFIX SELECTION */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
              Select Degree Pathway / Prefix
            </label>
            <select className="gf-input" value={selectedPrefix} onChange={(e) => setSelectedPrefix(e.target.value)}>
              {allowedPrefixes.map(prefix => (
                <option key={prefix} value={prefix}>{prefix}</option>
              ))}
            </select>
          </div>

          {/* MEMBER DETAILS */}
          <h3 style={{ marginBottom: '1rem' }}>Member Details</h3>
          {memberDetails.map((member, index) => (
            <div key={member.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>
                {member.name} {group.leaderId === member.id && <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>(Leader)</span>}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* UoW ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>UoW ID</label>
                  <input type="text" className="gf-input" placeholder="e.g. w1234567" value={member.uowId} onChange={(e) => handleDetailChange(index, 'uowId', e.target.value)} required />
                </div>
                {/* IIT ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>IIT ID</label>
                  <input type="text" className="gf-input" placeholder="e.g. 20220001" value={member.iitId} onChange={(e) => handleDetailChange(index, 'iitId', e.target.value)} required />
                </div>
                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Phone Number</label>
                  <input type="tel" className="gf-input" placeholder="07X XXX XXXX" value={member.phone} onChange={(e) => handleDetailChange(index, 'phone', e.target.value)} required />
                </div>
                {/* Tutorial Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Tutorial Group</label>
                  <input type="text" className="gf-input" placeholder="e.g. Group A / T1" value={member.tutorialGroup} onChange={(e) => handleDetailChange(index, 'tutorialGroup', e.target.value)} required />
                </div>
              </div>
            </div>
          ))}

          <button type="submit" className="gf-btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#10b981', padding: '1rem', fontSize: '1.1rem' }}>
            Submit for Lecturer Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinalisationFormView;