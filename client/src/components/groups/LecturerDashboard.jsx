import React, { useState } from 'react';
import './groups.css';

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('setup');
  
  // Form States for setting up a project
  const [moduleId, setModuleId] = useState('');
  const [minMembers, setMinMembers] = useState(3);
  const [maxMembers, setMaxMembers] = useState(5);
  const [deadline, setDeadline] = useState('');
  const [prefixes, setPrefixes] = useState('SE, CS, AI');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const prefixArray = prefixes.split(',').map(p => p.trim());
    
    // In reality, this would hit your /api/modules/:moduleId/group-project endpoint
    alert(`Created Group Project for ${moduleId}!\nPrefixes allowed: ${prefixArray.join(', ')}`);
    // Reset form
    setModuleId('');
  };

  return (
    <div className="gf-main" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
      <div className="gf-header">
        <h2>Lecturer Dashboard</h2>
        <p>Manage group projects and review finalisation requests</p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('setup')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'setup' ? '3px solid #5b7cbd' : 'none', fontWeight: activeTab === 'setup' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          Open Group Project
        </button>
        <button 
          onClick={() => setActiveTab('review')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'review' ? '3px solid #f59e0b' : 'none', fontWeight: activeTab === 'review' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          Pending Reviews (2)
        </button>
        <button 
          onClick={() => setActiveTab('finalised')}
          style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'finalised' ? '3px solid #10b981' : 'none', fontWeight: activeTab === 'finalised' ? 'bold' : 'normal', cursor: 'pointer' }}
        >
          Finalised Groups
        </button>
      </div>

      {/* TAB 1: SETUP PROJECT */}
      {activeTab === 'setup' && (
        <div className="gf-card-simple" style={{ padding: '2rem' }}>
          <h3>Open a New Group Project</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Allow students to start forming groups for a module.</p>
          
          <form onSubmit={handleCreateProject}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Module ID</label>
              <input type="text" className="gf-input" value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder="e.g., 5COSC019C" required />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Min Members</label>
                <input type="number" className="gf-input" value={minMembers} onChange={(e) => setMinMembers(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Max Members</label>
                <input type="number" className="gf-input" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Submission Deadline</label>
              <input type="date" className="gf-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Allowed Prefixes (Comma separated)</label>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Students will choose one of these when finalising.</p>
              <input type="text" className="gf-input" value={prefixes} onChange={(e) => setPrefixes(e.target.value)} placeholder="SE, CS, DS" required />
            </div>

            <button type="submit" className="gf-btn-primary">Open Group Formation</button>
          </form>
        </div>
      )}

      {/* TAB 2: PENDING REVIEWS */}
      {activeTab === 'review' && (
        <div>
          {/* We will map real data here later, using dummy UI for now */}
          <div className="gf-card-simple" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>TechTitans (Module: 5COSC019C)</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Requested Prefix: <strong>SE</strong> • Members: 5/5</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="gf-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Reject</button>
                <button className="gf-btn-primary" style={{ background: '#10b981' }}>Approve (Becomes SE-1)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINALISED GROUPS */}
      {activeTab === 'finalised' && (
        <div className="gf-grid">
           {/* Dummy Data for Finalised UI */}
           <div className="gf-card-simple" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
              <h3 style={{ margin: 0, color: '#10b981' }}>SE-1</h3>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>TechTitans</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Module: 5COSC019C</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Members: 5</p>
           </div>
           <div className="gf-card-simple" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
              <h3 style={{ margin: 0, color: '#10b981' }}>CS-1</h3>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>CodeCrafters</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Module: 5COSC019C</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Members: 4</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;