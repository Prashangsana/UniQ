import React, { useState, useEffect } from 'react';
import './groups.css';

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const [myModules, setMyModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  const [pendingGroups, setPendingGroups] = useState([]);
  const [finalisedGroups, setFinalisedGroups] = useState([]);
  
  // Form States for setting up a project
  const [moduleId, setModuleId] = useState('');
  const [minMembers, setMinMembers] = useState(3);
  const [maxMembers, setMaxMembers] = useState(5);
  const [deadline, setDeadline] = useState('');
  const [prefixes, setPrefixes] = useState('SE, CS, AI');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Lecturer's Modules
        const modRes = await fetch('http://localhost:5000/api/lecturer/modules/my-modules');
        const modData = await modRes.json();
        if (modData.success) {
          setMyModules(modData.data);
          if (modData.data.length > 0) setModuleId(modData.data[0]._id);
        }

        // Fetch Groups (Pending & Finalised)
        const grpRes = await fetch('http://localhost:5000/api/lecturer/module-groups');
        const grpData = await grpRes.json();
        if (grpData.success) {
          setPendingGroups(grpData.data.pending);
          setFinalisedGroups(grpData.data.finalised);
        }
      } catch (error) {
        console.error("Error fetching lecturer data", error);
      } finally {
        setIsLoadingModules(false);
      }
    };
    fetchData();
  }, [activeTab]); // Re-fetch when changing tabs to get latest data

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const prefixArray = prefixes.split(',').map(p => p.trim());
    const selectedModule = myModules.find(m => m._id === moduleId);
    
    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/modules/${moduleId}/group-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minMembers, maxMembers, deadline, allowedPrefixes: prefixArray, moduleName: selectedModule?.name })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Success! Project for ${moduleId} opened for students!`);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      alert("Failed to connect to server. Check your backend terminal for crash logs!");
    }
  };

  // --- NEW: Handle Approve/Reject Action ---
  const handleReview = async (groupId, action) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/groups/${groupId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback: action === 'reject' ? "Please adjust members" : "Approved" })
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Group ${action}ed successfully!`);
        // Remove from pending locally to update UI immediately
        setPendingGroups(prev => prev.filter(g => g._id !== groupId));
        if (action === 'approve') {
          // Add to finalised groups list locally
          setFinalisedGroups(prev => [...prev, data.data]);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Failed to process review.");
    }
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
          {/* Dynamically show the number of pending reviews */}
          Pending Reviews ({pendingGroups.length})
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
          
          {isLoadingModules ? (
            <p>Loading your assigned modules...</p>
          ) : myModules.length === 0 ? (
            <p style={{ color: '#ef4444' }}>You have not been assigned as a module leader to any modules yet.</p>
          ) : (
            <form onSubmit={handleCreateProject}>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Module</label>
                <select 
                  className="gf-input" 
                  value={moduleId} 
                  onChange={(e) => setModuleId(e.target.value)} 
                  required
                >
                  {myModules.map(mod => (
                    <option key={mod._id} value={mod._id}>
                      {mod._id} - {mod.name}
                    </option>
                  ))}
                </select>
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
          )}
        </div>
      )}

      {/* TAB 2: PENDING REVIEWS */}
      {activeTab === 'review' && (
        <div>
          {pendingGroups.length === 0 ? (
            <p style={{ color: '#64748b' }}>No pending reviews at this time.</p>
          ) : (
            pendingGroups.map(group => (
              <div key={group._id} className="gf-card-simple" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{group.name} (Module: {group.moduleId})</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                      Requested Prefix: <strong>{group.prefix || "N/A"}</strong> • Members: {group.members ? group.members.length : 0}/{group.maxMembers}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleReview(group._id, 'reject')} className="gf-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Reject</button>
                    <button onClick={() => handleReview(group._id, 'approve')} className="gf-btn-primary" style={{ background: '#10b981' }}>Approve</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: FINALISED GROUPS */}
      {activeTab === 'finalised' && (
        <div className="gf-grid">
           {finalisedGroups.length === 0 ? (
             <p style={{ color: '#64748b' }}>No finalised groups yet.</p>
           ) : (
             finalisedGroups.map(group => (
               <div key={group._id} className="gf-card-simple" style={{ padding: '1.5rem', borderTop: '4px solid #10b981' }}>
                  <h3 style={{ margin: 0, color: '#10b981' }}>{group.finalisedCode}</h3>
                  <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{group.name}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Module: {group.moduleId}</p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Members: {group.members ? group.members.length : 0}</p>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;