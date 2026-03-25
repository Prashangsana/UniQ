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
  const [editingModule, setEditingModule] = useState(null);
  const [editModalTab, setEditModalTab] = useState('basic');

  // Societies Tab State
  const [societies, setSocieties] = useState([]);
  const [students, setStudents] = useState([]);
  const [newSociety, setNewSociety] = useState({ id: '', name: '', description: '', leaderId: '' });
  const [editingSociety, setEditingSociety] = useState(null);

  // Fetch Users (Students/Lecturers)
  useEffect(() => {
    if (activeTab === 'users') {
      const roleToFetch = userSubTab === 'students' ? 'student' : 'lecturer';
      fetch(`${API_URL}/api/admin/users?role=${roleToFetch}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [activeTab, userSubTab, API_URL]);

  // Fetch Modules
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

  // Fetch Societies
  useEffect(() => {
    if (activeTab === 'societies') {
      fetch(`${API_URL}/api/societies`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setSocieties(data.data || []))
        .catch(err => console.error("Error fetching societies:", err));

      fetch(`${API_URL}/api/admin/users?role=student`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setStudents(data.users || []))
        .catch(err => console.error("Error fetching students:", err));
    }
  }, [activeTab, API_URL]);

  /* --- MODULE HANDLERS --- */
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

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm(`Are you sure you want to permanently remove module ${moduleId}?`)) return;
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

  const handleToggleTeamMember = (lecturerId) => {
    setEditingModule(prev => {
      const isCurrentlyInTeam = prev.moduleTeam.includes(lecturerId);
      return isCurrentlyInTeam 
        ? { ...prev, moduleTeam: prev.moduleTeam.filter(id => id !== lecturerId) }
        : { ...prev, moduleTeam: [...prev.moduleTeam, lecturerId] };
    });
  };

  /* --- SOCIETY HANDLERS --- */
  const handleAddSociety = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/societies/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          _id: newSociety.id,
          name: newSociety.name,
          shortName: newSociety.id,
          description: newSociety.description,
          leader: newSociety.leaderId
        })
      });
      const data = await response.json();
      if (data.success) {
        setSocieties([...societies, data.data]);
        setNewSociety({ id: '', name: '', description: '', leaderId: '' }); 
      } else {
        alert(data.message || "Failed to create society");
      }
    } catch (err) {
      console.error("Failed to add society:", err);
    }
  };

  const handleUpdateSociety = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/societies/leader/${editingSociety.originalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editingSociety.name,
          description: editingSociety.description,
          leader: editingSociety.leaderId
        })
      });
      const data = await response.json();
      if (data.success) {
        setSocieties(societies.map(soc => soc._id === editingSociety.originalId ? data.data : soc));
        setEditingSociety(null);
      } else {
        alert(data.message || "Failed to update society");
      }
    } catch (err) {
      console.error("Failed to update society:", err);
    }
  };

  const handleDeleteSociety = async (societyId) => {
    if (!window.confirm(`Are you sure you want to permanently remove society ${societyId}?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/societies/${societyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSocieties(societies.filter(soc => soc._id !== societyId));
      } else {
        alert(data.message || "Failed to delete society");
      }
    } catch (err) {
      console.error("Failed to delete society:", err);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Panel</div>
        <nav className="admin-nav">
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
          <button className={activeTab === 'modules' ? 'active' : ''} onClick={() => setActiveTab('modules')}>Modules</button>
          <button className={activeTab === 'societies' ? 'active' : ''} onClick={() => setActiveTab('societies')}>Societies</button>
          <div className="nav-spacer"></div>
          <button className="logout-btn" onClick={() => window.location.href = `${API_URL}/auth/logout`}>Logout</button>
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
                <input type="text" placeholder="Module Code" value={newModule.id} onChange={e => setNewModule({...newModule, id: e.target.value})} required />
                <input type="text" placeholder="Module Name" value={newModule.name} onChange={e => setNewModule({...newModule, name: e.target.value})} required />
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
                  <tr><th>Module Code</th><th>Name</th><th>Module Leader</th><th>Team Size</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {modules.map((mod) => (
                    <tr key={mod._id}>
                      <td>{mod._id}</td>
                      <td>{mod.name}</td>
                      <td>{mod.moduleLeaders?.[0]?.name || mod.moduleLeaders?.[0] || 'Unassigned'}</td>
                      <td>{mod.moduleTeam?.length || 0} Members</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="edit-btn"
                            onClick={() => {
                              setEditingModule({
                                originalId: mod._id,
                                id: mod._id,
                                name: mod.name,
                                leaderId: mod.moduleLeaders?.[0]?._id || mod.moduleLeaders?.[0],
                                moduleTeam: (mod.moduleTeam || []).map(m => m._id || m)
                              });
                              setEditModalTab('basic'); 
                            }}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteModule(mod._id)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            <div className="add-module-card">
              <h3>Add New Society</h3>
              <form onSubmit={handleAddSociety} className="add-society-form">
                <input type="text" placeholder="Society ID (e.g. WIE)" value={newSociety.id} onChange={e => setNewSociety({...newSociety, id: e.target.value})} required />
                <input type="text" placeholder="Society Name" value={newSociety.name} onChange={e => setNewSociety({...newSociety, name: e.target.value})} required />
                <input type="text" placeholder="Description" value={newSociety.description} onChange={e => setNewSociety({...newSociety, description: e.target.value})} required />
                <select value={newSociety.leaderId} onChange={e => setNewSociety({...newSociety, leaderId: e.target.value})} required>
                  <option value="" disabled>Assign Leader (Student)</option>
                  {students.map(st => (<option key={st._id} value={st._id}>{st.name} ({st.email})</option>))}
                </select>
                <button type="submit" className="submit-btn">Create Society</button>
              </form>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Society ID</th><th>Name</th><th>Leader</th><th>Followers</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {societies.map((soc) => {
                    const assignedStudent = students.find(st => st._id === soc.leader);
                    const leaderDisplay = assignedStudent ? assignedStudent.name : (soc.leader || 'Unassigned');

                    return (
                      <tr key={soc._id}>
                        <td>{soc._id}</td>
                        <td>{soc.name}</td>
                        <td>{leaderDisplay}</td>
                        <td>{soc.followersCount || 0}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="edit-btn"
                              onClick={() => setEditingSociety({
                                originalId: soc._id,
                                name: soc.name,
                                description: soc.description || '',
                                leaderId: soc.leader || ''
                              })}
                            >Edit</button>
                            <button className="delete-btn" onClick={() => handleDeleteSociety(soc._id)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {societies.length === 0 && (<tr><td colSpan="5">No societies available.</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODULE MODAL OVERLAY */}
      {editingModule && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Edit Module</h3>
            <div className="admin-modal-tabs">
              <button className={editModalTab === 'basic' ? 'active-tab' : ''} onClick={() => setEditModalTab('basic')}>Basic Info</button>
              <button className={editModalTab === 'team' ? 'active-tab' : ''} onClick={() => setEditModalTab('team')}>Module Team</button>
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
                          <input type="checkbox" checked={editingModule.moduleTeam.includes(lec._id)} onChange={() => handleToggleTeamMember(lec._id)} />
                          {lec.name} <span className="team-email">({lec.email})</span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingModule(null)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOCIETY MODAL OVERLAY */}
      {editingSociety && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Edit Society</h3>
            <form onSubmit={handleUpdateSociety} className="edit-module-form">
              <label>Society Name:</label>
              <input type="text" value={editingSociety.name} onChange={e => setEditingSociety({...editingSociety, name: e.target.value})} required />
              
              <label>Description:</label>
              <input type="text" value={editingSociety.description} onChange={e => setEditingSociety({...editingSociety, description: e.target.value})} required />
              
              <label>Society Leader (Student):</label>
              <select value={editingSociety.leaderId} onChange={e => setEditingSociety({...editingSociety, leaderId: e.target.value})} required>
                <option value="" disabled>Select Leader</option>
                {students.map(st => (<option key={st._id} value={st._id}>{st.name}</option>))}
              </select>
              
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingSociety(null)}>Cancel</button>
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