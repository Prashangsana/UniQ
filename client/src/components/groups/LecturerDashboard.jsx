import React, { useState, useEffect, useCallback } from 'react';
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

  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectGroupId, setRejectGroupId] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');

  const toggleExpand = (id) => {
    setExpandedGroupId(prevId => (prevId === id ? null : id));
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoadingModules(true);
      const token = localStorage.getItem('token');

      // Common headers including the JWT token
      const headers = {
        'Content-Type': 'application/json'
      };

      // Fetch Lecturer's Modules
      const modRes = await fetch('http://localhost:5000/api/lecturer/modules/my-modules', {
        credentials: 'include',
        headers: headers
      });
      const modData = await modRes.json();
      if (modData.success) {
        setMyModules(modData.data);
        if (modData.data.length > 0 && !moduleId) setModuleId(modData.data[0]._id);
      }

      // Fetch Groups
      const grpRes = await fetch('http://localhost:5000/api/lecturer/module-groups', {
        credentials: 'include',
        headers: headers
      });
      const grpData = await grpRes.json();
      if (grpData.success) {
        setPendingGroups(grpData.data.pending || []);
        setFinalisedGroups(grpData.data.finalised || []);
      }
    } catch (error) {
      console.error("Error fetching lecturer data", error);
    } finally {
      setIsLoadingModules(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (parseInt(maxMembers) < parseInt(minMembers)) {
      alert("Max members cannot be less than Min members.");
      return;
    }

    const prefixArray = prefixes.split(',').map(p => p.trim());
    const selectedModule = myModules.find(m => m._id === moduleId);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/modules/${moduleId}/group-project`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minMembers: parseInt(minMembers),
          maxMembers: parseInt(maxMembers),
          deadline,
          allowedPrefixes: prefixArray,
          moduleName: selectedModule?.name
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Success! Project for ${selectedModule?.name || moduleId} opened for students!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      alert("Failed to connect to server. Check your backend terminal for crash logs!");
    }
  };

  const handleReview = async (groupId, action) => {
    if (action === 'reject') {
      setRejectGroupId(groupId);
      setRejectFeedback(''); // Reset feedback
      setIsRejectModalOpen(true);
      return; // Stop here and wait for modal confirmation
    }

    // If action is 'approve', proceed as normal
    await processReview(groupId, 'approve', 'Approved');
  };

  const confirmReject = async () => {
    if (!rejectFeedback.trim()) {
      alert("Please provide feedback so students know what to fix.");
      return;
    }
    await processReview(rejectGroupId, 'reject', rejectFeedback);
    setIsRejectModalOpen(false);
  };

  // Extracted logic to keep code clean
  const processReview = async (groupId, action, feedback) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/groups/${groupId}/review`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback })
      });
      const data = await response.json();

      if (data.success) {
        alert(`Group ${action}ed successfully!`);
        setPendingGroups(prev => prev.filter(g => g._id !== groupId));
        if (action === 'approve') {
          setFinalisedGroups(prev => [...prev, data.data]);
        }
      }
    } catch (error) {
      alert("Error processing request.");
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
                  className="gf-form-input"
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
                  <input type="number" className="gf-form-input" value={minMembers} onChange={(e) => setMinMembers(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Max Members</label>
                  <input type="number" className="gf-form-input" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Submission Deadline</label>
                <input type="date" className="gf-form-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Allowed Prefixes (Comma separated)</label>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>Students will choose one of these when finalising.</p>
                <input type="text" className="gf-form-input" value={prefixes} onChange={(e) => setPrefixes(e.target.value)} placeholder="SE, CS, DS" required />
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
            pendingGroups.map(group => {
              const isExpanded = expandedGroupId === group._id;

              return (
                <div
                  key={group._id}
                  className="gf-card-simple"
                  style={{
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #f59e0b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => toggleExpand(group._id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{group.name} <small style={{ color: '#64748b' }}>({group.moduleId})</small></h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: isExpanded ? '#5b7cbd' : '#64748b' }}>
                        {isExpanded ? '▴ Click to collapse' : '▾ Click to view submission details'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReview(group._id, 'reject'); }}
                        className="gf-btn-outline"
                        style={{ color: '#ef4444', borderColor: '#ef4444', padding: '5px 15px' }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReview(group._id, 'approve'); }}
                        className="gf-btn-primary"
                        style={{ background: '#10b981', padding: '5px 15px' }}
                      >
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* EXPANDED SECTION */}
                  {isExpanded && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }} onClick={(e) => e.stopPropagation()}>

                      {!group.finalisationForm ? (
                        <div style={{ padding: '1rem', background: '#fff2f2', border: '1px solid #ef4444', borderRadius: '8px' }}>
                          <p style={{ color: '#b91c1c', margin: '0 0 10px 0' }}>
                            <strong>⚠️ Data Missing in Database</strong>
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                            The field <code>finalisationForm</code> is undefined for this group ID: <code>{group._id}</code>.
                            This usually happens if the student submission failed or the field wasn't included in the API response.
                          </p>
                          {/* This button helps you see the raw object in console */}
                          <button
                            onClick={() => console.log("Raw Group Object:", group)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Log Raw Data to Console
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
                            <div className="detail-item">
                              <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Tutorial Group</label>
                              <strong>{group.finalisationForm.tutorialGroup}</strong>
                            </div>
                            <div className="detail-item">
                              <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Requested Prefix</label>
                              <strong style={{ color: '#5b7cbd' }}>{group.prefix}</strong>
                            </div>
                          </div>

                          <h5 style={{ marginBottom: '10px' }}>Member Registration Details</h5>
                          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <thead>
                              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>IIT ID</th>
                                <th style={{ padding: '10px' }}>UOW ID</th>
                                <th style={{ padding: '10px' }}>Phone Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.members?.map(member => {
                                const mId = member?._id || member;
                                const mName = member?.name || "Unknown Student";

                                const extra = group.finalisationForm?.memberExtraInfo?.find(info =>
                                  (info.userId?._id || info.userId)?.toString() === mId?.toString()
                                );

                                return (
                                  <tr key={mId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px' }}>{mName}</td>
                                    <td style={{ padding: '10px', fontFamily: 'monospace' }}>{extra?.iitId || 'Not Provided'}</td>
                                    <td style={{ padding: '10px', fontFamily: 'monospace' }}>{extra?.uowId || 'Not Provided'}</td>
                                    <td style={{ padding: '10px' }}>{extra?.phone || 'N/A'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: FINALISED GROUPS */}
      {activeTab === 'finalised' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {finalisedGroups.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>No finalised groups yet.</p>
          ) : (
            finalisedGroups.map(group => {
              const isExpanded = expandedGroupId === group._id;

              return (
                <div
                  key={group._id}
                  className="gf-card-simple"
                  style={{
                    padding: '1.25rem',
                    borderLeft: '5px solid #10b981',
                    cursor: 'pointer',
                    background: '#fff',
                    transition: 'transform 0.1s ease'
                  }}
                  onClick={() => toggleExpand(group._id)}
                >
                  {/* Top Row: Summary Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        minWidth: '60px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }}>
                        {group.finalisedCode}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{group.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                          Module: {group.moduleId} • <span style={{ color: '#10b981' }}>{isExpanded ? 'Click to collapse' : 'Click to view details'}</span>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontWeight: '600' }}>
                      <span style={{ fontSize: '1.2rem' }}>✓</span> Finalised
                    </div>
                  </div>

                  {/* Expanded Section: Content now uses full card width */}
                  {isExpanded && group.finalisationForm && (
                    group.finalisationForm ? (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
                          <div className="detail-item">
                            <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Tutorial Group</label>
                            <strong>{group.finalisationForm.tutorialGroup}</strong>
                          </div>
                          <div className="detail-item">
                            <label style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Requested Prefix</label>
                            <strong style={{ color: '#5b7cbd' }}>{group.prefix}</strong>
                          </div>
                        </div>

                        <h5 style={{ marginBottom: '10px' }}>Member Registration Details</h5>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                              <th style={{ padding: '10px' }}>Name</th>
                              <th style={{ padding: '10px' }}>IIT ID</th>
                              <th style={{ padding: '10px' }}>UOW ID</th>
                              <th style={{ padding: '10px' }}>Phone Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.members.map(member => {
                              const mId = member?._id || member;
                              const mName = member?.name || "Unknown Student";

                              const extra = group.finalisationForm?.memberExtraInfo?.find(info =>
                                (info.userId?._id || info.userId)?.toString() === mId?.toString()
                              );

                              return (
                                <tr key={mId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '10px' }}>{mName}</td>
                                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>{extra?.iitId || 'Not Provided'}</td>
                                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>{extra?.uowId || 'Not Provided'}</td>
                                  <td style={{ padding: '10px' }}>{extra?.phone || 'N/A'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', color: '#991b1b', borderRadius: '8px' }}>
                        ⚠️ <strong>Data Error:</strong> No finalisation details found for this group.
                        Check if the submission saved correctly in the database.
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* REJECTION FEEDBACK MODAL */}
      {isRejectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="gf-card-simple" style={{ width: '400px', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Reject Group Submission</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Explain to the students what needs to be changed.</p>

            <textarea
              className="gf-form-input"
              style={{ width: '100%', height: '100px', marginBottom: '1.5rem', padding: '10px', boxSizing: 'border-box' }}
              placeholder="e.g. Member IIT-001 has the wrong phone number..."
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsRejectModalOpen(false)} className="gf-btn-outline">Cancel</button>
              <button onClick={confirmReject} className="gf-btn-primary" style={{ background: '#ef4444' }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;