import React, { useState, useEffect } from 'react';
import './groups.css';
import GroupsSidebar from './GroupsSidebar';

const GroupDetailsView = ({ group: initialGroupData, onBack, onViewProfile, onFindMembers, onFinalise, currentUser }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (group) setNewName(group.name);
  }, [group]);

  const handleLeaveGroup = async () => {
    if (window.confirm(`Are you sure you want to leave ${group.name}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/groups/${group._id}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          alert(data.message);
          onBack();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        alert("Failed to leave group. Is the server running?");
      }
    }
  };

  const handleRequestJoin = async () => {
    setRequesting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/requests/groups/${group._id}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      alert("Request Sent");
    } catch (e) {
      alert("Server error");
    } finally {
      setRequesting(false);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation: Check if it's an image
    if (!file.type.startsWith('image/')) {
      return alert("Please select an image file.");
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch(`http://localhost:5000/api/groups/groups/${group._id}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ img: base64Image })
        });

        const data = await response.json();
        if (data.success) {
          setGroup({ ...group, img: base64Image });
          alert("Group image updated!");
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        aconsole.error("Upload Error:", error); // This will show the actual error in the Browser Console (F12)
        alert("Failed to upload image. Check console for details.");
      }
    };
  };

  const handleUpdateName = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/groups/${group._id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName })
      });

      const data = await response.json();
      if (data.success) {
        setGroup({ ...group, name: newName });
        setIsEditingName(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to update name");
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/groups/${initialGroupData._id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setGroup(data.data);
        } else {
          console.error("Server returned error:", data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (initialGroupData && initialGroupData._id) {
      fetchGroupDetails();
    } else {
      setLoading(false);
    }
  }, [initialGroupData]);

  if (loading) return <div className="gf-main">Loading group details...</div>;
  if (!group) return <div className="gf-main">Group not found.</div>;

  const myId = (currentUser?._id || currentUser?.id)?.toString();

  // Check if current user is in the group.members array
  const isMember = group?.members?.some(m => {
    if (!m) return false;
    const memberId = (m._id || m).toString();
    return memberId === myId;
  }) || false;

  // Check if current user is the leader
  const groupLeaderId = (group?.leader?._id || group?.leader)?.toString();
  const isLeader = groupLeaderId === myId;

  const canInvite = isMember && group.status === 'open';

  const vacantSlots = Math.max(0, group.maxMembers - group.members.length);

  return (
    <div className="gf-layout">
      <div className="gf-main">
        <button className="gf-btn-back" onClick={onBack}>&larr; Back</button>

        {/* --- NEW: Group Image Header --- */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '15px',
          overflow: 'hidden',
          marginBottom: '2rem',
          backgroundColor: '#e2e8f0'
        }}>
          <img
            src={group.img || 'https://varthana.com/school/wp-content/uploads/2023/08/B512.jpg'}
            alt="Group cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {isLeader && (
            <>
              {/* The actual hidden file input */}
              <input
                type="file"
                id="group-img-upload"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* The label acts as the clickable button */}
              <label
                htmlFor="group-img-upload"
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                📸 Change Cover
              </label>
            </>
          )}
        </div>

        <div className="gf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* FEEDBACK ALERT FOR REJECTED GROUPS */}
          {group.status === 'open' && group.feedback && group.feedback !== "Approved" && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fda4af',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '2rem' }}>📢</div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#9f1239' }}>Lecturer Feedback</h4>
                <p style={{ margin: 0, color: '#be123c', fontWeight: '500' }}>
                  "{group.feedback}"
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#e11d48', fontStyle: 'italic' }}>
                  Please make the requested changes and submit for finalisation again.
                </p>
              </div>
            </div>
          )}
          <div>
            <div>
              {isEditingName ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    className="gf-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '5px' }}
                  />
                  <button className="gf-btn-primary" onClick={handleUpdateName}>Save</button>
                  <button className="gf-btn-outline" onClick={() => setIsEditingName(false)}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0 }}>{group.name}</h2>
                  {isLeader && (
                    <button
                      onClick={() => {
                        setNewName(group.name); // Reset to current name before opening
                        setIsEditingName(true);
                      }}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background 0.2s'
                      }}
                      title="Edit Group Name"
                      onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <p>{group.domain} • {group.members.length}/{group.maxMembers} Members</p>
            </div>
          </div>
          <div>
            {isMember ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Only show Leave button if group isn't finalised/pending */}
                {group.status === 'open' && (
                  <button className="gf-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={handleLeaveGroup}>Leave Group</button>
                )}

                {/* ONLY show Submit button if Leader AND Group is Full AND status is still 'open' */}
                {isLeader && group.members.length === group.maxMembers && group.status === 'open' && (
                  <button className="gf-btn-primary" onClick={() => onFinalise(group)}>Submit for Finalisation</button>
                )}

                {/* NEW: Show status indicators for the student */}
                {group.status === 'pending_review' && (
                  <span style={{ padding: '8px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontWeight: 'bold' }}>
                    Pending Lecturer Review
                  </span>
                )}

                {group.status === 'finalised' && (
                  <span style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontWeight: 'bold' }}>
                    Group Finalised ({group.finalisedCode})
                  </span>
                )}
              </div>
            ) : (
              group.status === 'open' && group.members.length < group.maxMembers ? (
                <button
                  className="gf-btn-primary"
                  onClick={handleRequestJoin}
                  disabled={requesting}
                >
                  {requesting ? 'Sending Request...' : 'Request to Join'}
                </button>
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {group.status === 'open' ? 'Group is Full' : 'Registration Closed'}
                </span>
              )
            )}
          </div>
        </div>

        <h3 className="gf-section-title">Members</h3>
        <div className="gf-grid">
          {group.members.map(member => (
            <div key={member._id} className="gf-card-simple" onClick={() => onViewProfile(member)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                <div>
                  <strong style={{ display: 'block' }}>{member.name}</strong>
                  <small style={{ color: '#64748b' }}>{member._id === (group.leader._id || group.leader) ? 'Leader' : 'Member'}</small>
                </div>
              </div>
              <div>
                {(member.skills || ['Student']).map(skill => (
                  <span key={skill} className="gf-skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}

          {/* Vacant slots logic */}
          {[...Array(Math.max(0, group.maxMembers - group.members.length))].map((_, i) => (
            <div
              key={`vac-${i}`}
              className="gf-card-simple"
              style={{
                borderStyle: 'dashed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: isMember ? 'pointer' : 'default'
              }}
              onClick={() => {
                console.log("Is Member?", isMember); // Debugging line
                if (canInvite) {
                  onFindMembers(group.moduleId, group._id);
                } else if (!isMember) {
                  alert("Only group members can invite others.");
                } else {
                  alert("Cannot invite members once the group is submitted or finalised.");
                }
              }}
            >
              {isMember ? '+ Find Member' : 'Empty Spot'}
            </div>
          ))}
        </div>
      </div>

      {isMember && (
        <GroupsSidebar
          type="group"
          groupId={group._id}
          deadlines={group.deadlines} // Pass the group's specific deadlines
          onViewProfile={onViewProfile}
        />
      )}
    </div>
  );
};

export default GroupDetailsView;