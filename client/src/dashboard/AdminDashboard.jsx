import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Users Tab State
  const [userSubTab, setUserSubTab] = useState('students');
  const [users, setUsers] = useState([]);

  // Modules Tab State
  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [newModule, setNewModule] = useState({ id: '', name: '', leaderId: '' });
  
  // State for the Edit Modal
  const [editingModule, setEditingModule] = useState(null);
  const [editModalTab, setEditModalTab] = useState('basic');

  // Fetch Users
  useEffect(() => {
    if (activeTab === 'users') {
      const roleToFetch = userSubTab === 'students' ? 'student' : 'lecturer';
      fetch(`${API_URL}/api/admin/users?role=${roleToFetch}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [activeTab, userSubTab, API_URL]);

  // Fetch Modules and Lecturers
  useEffect(() => {
    if (activeTab === 'modules') {
      fetch(`${API_URL}/api/modules`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setModules(data.modules || []))
        .catch(err => console.error("Error fetching modules:", err));

      fetch(`${API_URL}/api/admin/users?role=lecturer`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setLecturers(data.users || []))
        .catch(err => console.error("Error fetching lecturers:", err));
    }
  }, [activeTab, API_URL]);

  // Handle Module Submit
  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          _id: newModule.id,
          name: newModule.name,
          moduleLeaders: [newModule.leaderId],
          moduleTeam: []
        })
      });
      const data = await response.json();
      if (data.success) {
        setModules([...modules, data.module]);
        setNewModule({ id: '', name: '', leaderId: '' }); 
      }
    } catch (err) {
      console.error("Failed to add module:", err);
    }
  };

  // Handle Module Update
  const handleUpdateModule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/modules/${editingModule.originalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          newId: editingModule.id,
          name: editingModule.name,
          moduleLeaders: [editingModule.leaderId],
          moduleTeam: editingModule.moduleTeam
        })
      });
      const data = await response.json();
      if (data.success) {
        setModules(modules.map(mod => mod._id === editingModule.originalId ? data.module : mod));
        setEditingModule(null);
      } else {
        alert(data.message || "Failed to update module");
      }
    } catch (err) {
      console.error("Failed to update module:", err);
    }
  };

  // Handle Module Delete
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm(`Are you sure you want to permanently remove module ${moduleId}?`)) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setModules(modules.filter(mod => mod._id !== moduleId));
      } else {
        alert(data.message || "Failed to delete module");
      }
    } catch (err) {
      console.error("Failed to delete module:", err);
    }
  };

  // Toggle Team Member
  const handleToggleTeamMember = (lecturerId) => {
    setEditingModule(prev => {
      const isCurrentlyInTeam = prev.moduleTeam.includes(lecturerId);
      if (isCurrentlyInTeam) {
        return { ...prev, moduleTeam: prev.moduleTeam.filter(id => id !== lecturerId) };
      } else {
        return { ...prev, moduleTeam: [...prev.moduleTeam, lecturerId] };
      }
    });
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={activeTab === 'modules' ? 'active' : ''} 
            onClick={() => setActiveTab('modules')}
          >
            Modules
          </button>
          <button 
            className={activeTab === 'societies' ? 'active' : ''} 
            onClick={() => setActiveTab('societies')}
          >
            Societies & Events
          </button>
          
          <div className="nav-spacer"></div>
          <button 
            className="logout-btn"
            onClick={() => window.location.href = `${API_URL}/auth/logout`}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="sub-tabs">
              <button className={userSubTab === 'students' ? 'active-sub' : ''} onClick={() => setUserSubTab('students')}>Students</button>
              <button className={userSubTab === 'lecturers' ? 'active-sub' : ''} onClick={() => setUserSubTab('lecturers')}>Lecturers</button>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(user => (<tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>))}
                  {users.length === 0 && <tr><td colSpan="3">No {userSubTab} found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULES TAB */}
        {activeTab === 'modules' && (
          <div className="admin-section">
            <h2>Module Management</h2>
            
            <div className="add-module-card">
              <h3>Add New Module</h3>
              <form onSubmit={handleAddModule} className="add-module-form">
                <input type="text" placeholder="Module Code (e.g. 5COSC021C)" value={newModule.id} onChange={e => setNewModule({...newModule, id: e.target.value})} required />
                <input type="text" placeholder="Module Name (e.g. Database Systems)" value={newModule.name} onChange={e => setNewModule({...newModule, name: e.target.value})} required />
                <select value={newModule.leaderId} onChange={e => setNewModule({...newModule, leaderId: e.target.value})} required>
                  <option value="" disabled>Assign Module Leader</option>
                  {lecturers.map(lec => (<option key={lec._id} value={lec._id}>{lec.name} ({lec.email})</option>))}
                </select>
                <button type="submit" className="submit-btn">Create Module</button>
              </form>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Module Code</th>
                    <th>Name</th>
                    <th>Module Leader</th>
                    <th>Team Size</th>
                    <th>Actions</th> 
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod, index) => {
                    const safeId = String(mod?._id || `unknown-${index}`);
                    const safeName = String(mod?.name || 'Unknown Module');
                    const teamSize = mod?.moduleTeam?.length || 0;
                    
                    let safeLeader = 'Unassigned';
                    let safeLeaderId = '';
                    if (mod?.moduleLeaders && mod.moduleLeaders.length > 0) {
                      const leader = mod.moduleLeaders[0];
                      if (typeof leader === 'object' && leader !== null) {
                        safeLeader = String(leader.name || 'Unknown Name');
                        safeLeaderId = leader._id;
                      } else {
                        safeLeader = String(leader);
                        safeLeaderId = leader;
                      }
                    }

                    return (
                      <tr key={safeId}>
                        <td>{safeId}</td>
                        <td>{safeName}</td>
                        <td>{safeLeader}</td>
                        <td>{teamSize} Members</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="edit-btn"
                              onClick={() => {
                                const teamIds = (mod?.moduleTeam || []).map(member => 
                                  typeof member === 'object' ? member._id : member
                                );
                                setEditingModule({
                                  originalId: safeId,
                                  id: safeId,
                                  name: safeName,
                                  leaderId: safeLeaderId,
                                  moduleTeam: teamIds
                                });
                                setEditModalTab('basic'); 
                              }}
                            >
                              Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteModule(safeId)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {modules.length === 0 && (<tr><td colSpan="5">No modules available.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SOCIETIES TAB */}
        {activeTab === 'societies' && (
          <div className="admin-section">
            <h2>Societies & Events</h2>
            <div className="placeholder-card"><p>Society management features coming soon.</p></div>
          </div>
        )}
      </main>

      {/* MODAL OVERLAY */}
      {editingModule && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Module</h3>
            
            <div className="modal-tabs">
              <button 
                className={editModalTab === 'basic' ? 'active-tab' : ''} 
                onClick={() => setEditModalTab('basic')}
              >
                Basic Info
              </button>
              <button 
                className={editModalTab === 'team' ? 'active-tab' : ''} 
                onClick={() => setEditModalTab('team')}
              >
                Module Team
              </button>
            </div>

            <form onSubmit={handleUpdateModule} className="edit-module-form">
              
              {editModalTab === 'basic' && (
                <>
                  <label>Module Code:</label>
                  <input type="text" value={editingModule.id} onChange={e => setEditingModule({...editingModule, id: e.target.value})} required />
                  
                  <label>Module Name:</label>
                  <input type="text" value={editingModule.name} onChange={e => setEditingModule({...editingModule, name: e.target.value})} required />
                  
                  <label>Module Leader:</label>
                  <select value={editingModule.leaderId} onChange={e => setEditingModule({...editingModule, leaderId: e.target.value})} required>
                    <option value="" disabled>Select Leader</option>
                    {lecturers.map(lec => (<option key={lec._id} value={lec._id}>{lec.name}</option>))}
                  </select>
                </>
              )}

              {editModalTab === 'team' && (
                <>
                  <label>Select Lecturers for Module Team:</label>
                  <div className="team-selection-list">
                    {lecturers.map(lec => {
                      if(lec._id === editingModule.leaderId) return null; 
                      return (
                        <label key={lec._id} className="team-checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={editingModule.moduleTeam.includes(lec._id)}
                            onChange={() => handleToggleTeamMember(lec._id)}
                          />
                          {lec.name} <span className="team-email">({lec.email})</span>
                        </label>
                      );
                    })}
                    {lecturers.length <= 1 && <p style={{fontSize:'0.85rem', color:'#666'}}>No other lecturers available.</p>}
                  </div>
                </>
              )}
              
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingModule(null)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;