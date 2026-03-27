import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // State Management
  const [userSubTab, setUserSubTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [newModule, setNewModule] = useState({ id: '', name: '', leaderId: '' });
  const [editingModule, setEditingModule] = useState(null);
  const [editModalTab, setEditModalTab] = useState('basic');
  const [societies, setSocieties] = useState([]);
  const [students, setStudents] = useState([]);
  const [newSociety, setNewSociety] = useState({ id: '', name: '', description: '', leaderId: '' });
  const [editingSociety, setEditingSociety] = useState(null);

  // Data Fetching
  useEffect(() => {
    if (activeTab === 'users') {
      const roleToFetch = userSubTab === 'students' ? 'student' : 'lecturer';
      fetch(`${API_URL}/api/admin/users?role=${roleToFetch}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUsers(data.users || []));
    }
  }, [activeTab, userSubTab, API_URL]);

  useEffect(() => {
    if (activeTab === 'modules') {
      fetch(`${API_URL}/api/modules`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setModules(data.modules || []));
      fetch(`${API_URL}/api/admin/users?role=lecturer`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setLecturers(data.users || []));
    }
  }, [activeTab, API_URL]);

  useEffect(() => {
    if (activeTab === 'societies') {
      fetch(`${API_URL}/api/societies`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setSocieties(data.data || []));
      fetch(`${API_URL}/api/admin/users?role=student`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setStudents(data.users || []));
    }
  }, [activeTab, API_URL]);

  // Handlers
  const handleAddModule = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ _id: newModule.id, name: newModule.name, moduleLeaders: [newModule.leaderId], moduleTeam: [] })
    });
    const data = await response.json();
    if (data.success) { setModules([...modules, data.module]); setNewModule({ id: '', name: '', leaderId: '' }); }
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/modules/${editingModule.originalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newId: editingModule.id, name: editingModule.name, moduleLeaders: [editingModule.leaderId], moduleTeam: editingModule.moduleTeam })
    });
    if ((await response.json()).success) {
      setModules(modules.map(m => m._id === editingModule.originalId ? { ...m, _id: editingModule.id, name: editingModule.name } : m));
      setEditingModule(null);
    }
  };

  const handleAddSociety = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/societies/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ _id: newSociety.id, name: newSociety.name, shortName: newSociety.id, description: newSociety.description, leader: newSociety.leaderId })
    });
    const data = await response.json();
    if (data.success) { setSocieties([...societies, data.data]); setNewSociety({ id: '', name: '', description: '', leaderId: '' }); }
  };

  const handleUpdateSociety = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/api/societies/leader/${editingSociety.originalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: editingSociety.name, description: editingSociety.description, leader: editingSociety.leaderId })
    });
    if ((await response.json()).success) {
      setSocieties(societies.map(s => s._id === editingSociety.originalId ? { ...s, name: editingSociety.name, description: editingSociety.description, leader: editingSociety.leaderId } : s));
      setEditingSociety(null);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Delete module?")) return;
    const response = await fetch(`${API_URL}/api/modules/${id}`, { method: 'DELETE', credentials: 'include' });
    if ((await response.json()).success) setModules(modules.filter(m => m._id !== id));
  };

  const handleDeleteSociety = async (id) => {
    if (!window.confirm("Delete society?")) return;
    const response = await fetch(`${API_URL}/api/societies/${id}`, { method: 'DELETE', credentials: 'include' });
    if ((await response.json()).success) setSocieties(societies.filter(s => s._id !== id));
  };

  const handleToggleTeamMember = (lecturerId) => {
    setEditingModule(prev => {
      const isCurrentlyInTeam = prev.moduleTeam.includes(lecturerId);
      return isCurrentlyInTeam 
        ? { ...prev, moduleTeam: prev.moduleTeam.filter(id => id !== lecturerId) }
        : { ...prev, moduleTeam: [...prev.moduleTeam, lecturerId] };
    });
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">UniQ Admin</div>
        <nav className="admin-nav">
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <Icon icon="lucide:users" width="20" /> <span>User Management</span>
          </button>
          <button className={activeTab === 'modules' ? 'active' : ''} onClick={() => setActiveTab('modules')}>
            <Icon icon="lucide:book-open" width="20" /> <span>Modules</span>
          </button>
          <button className={activeTab === 'societies' ? 'active' : ''} onClick={() => setActiveTab('societies')}>
            <Icon icon="lucide:party-popper" width="20" /> <span>Societies</span>
          </button>
          <div className="nav-spacer"></div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = `${API_URL}/auth/logout`; }}>
            <Icon icon="lucide:log-out" width="20" /> <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === 'users' && (
          <div className="admin-section fade-in">
            <h2>User Management</h2>
            <div className="sub-tabs">
              <button className={userSubTab === 'students' ? 'active-sub' : ''} onClick={() => setUserSubTab('students')}>Students</button>
              <button className={userSubTab === 'lecturers' ? 'active-sub' : ''} onClick={() => setUserSubTab('lecturers')}>Lecturers</button>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="admin-section fade-in">
            <h2>Module Management</h2>
            <div className="add-module-card">
              <h3>Add New Module</h3>
              <form onSubmit={handleAddModule} className="add-form-bar">
                <input type="text" placeholder="ID" value={newModule.id} onChange={e => setNewModule({...newModule, id: e.target.value})} required />
                <input type="text" placeholder="Name" value={newModule.name} onChange={e => setNewModule({...newModule, name: e.target.value})} required />
                <select value={newModule.leaderId} onChange={e => setNewModule({...newModule, leaderId: e.target.value})} required>
                  <option value="" disabled>Leader</option>
                  {lecturers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
                <button type="submit" className="submit-btn">Create</button>
              </form>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>Code</th><th>Name</th><th>Leader</th><th>Team</th><th>Actions</th></tr></thead>
                <tbody>
                  {modules.map(m => (
                    <tr key={m._id}>
                      <td>{m._id}</td>
                      <td>{m.name}</td>
                      <td>{m.moduleLeaders?.[0]?.name || 'Unassigned'}</td>
                      <td>{m.moduleTeam?.length || 0} Members</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => {
                          setEditingModule({
                            originalId: m._id, id: m._id, name: m.name,
                            leaderId: m.moduleLeaders?.[0]?._id || m.moduleLeaders?.[0],
                            moduleTeam: (m.moduleTeam || []).map(t => t._id || t)
                          });
                          setEditModalTab('basic');
                        }}><Icon icon="lucide:edit-3" width="18" /></button>
                        <button className="delete-btn" onClick={() => handleDeleteModule(m._id)}><Icon icon="lucide:trash-2" width="18" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'societies' && (
          <div className="admin-section fade-in">
            <h2>Societies Management</h2>
            <div className="add-module-card">
              <h3>Add New Society</h3>
              <form onSubmit={handleAddSociety} className="add-form-bar">
                <input type="text" placeholder="ID" value={newSociety.id} onChange={e => setNewSociety({...newSociety, id: e.target.value})} required />
                <input type="text" placeholder="Name" value={newSociety.name} onChange={e => setNewSociety({...newSociety, name: e.target.value})} required />
                <select value={newSociety.leaderId} onChange={e => setNewSociety({...newSociety, leaderId: e.target.value})} required>
                  <option value="" disabled>Leader</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <button type="submit" className="submit-btn">Create</button>
              </form>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Leader</th><th>Followers</th><th>Actions</th></tr></thead>
                <tbody>
                  {societies.map(s => (
                    <tr key={s._id}>
                      <td>{s._id}</td>
                      <td>{s.name}</td>
                      <td>{students.find(st => st._id === s.leader)?.name || 'Unassigned'}</td>
                      <td>{s.followersCount || 0}</td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => setEditingSociety({
                          originalId: s._id, name: s.name, description: s.description || '', leaderId: s.leader || ''
                        })}><Icon icon="lucide:edit-3" width="18" /></button>
                        <button className="delete-btn" onClick={() => handleDeleteSociety(s._id)}><Icon icon="lucide:trash-2" width="18" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- NEAT EDIT DRAWER --- */}
      {(editingModule || editingSociety) && (
        <div className="admin-drawer-overlay" onClick={() => { setEditingModule(null); setEditingSociety(null); }}>
          <div className="admin-drawer-content fade-in-right" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editingModule ? 'Edit Module' : 'Edit Society'}</h3>
              <button className="close-drawer" onClick={() => { setEditingModule(null); setEditingSociety(null); }}>
                <Icon icon="lucide:x" width="24" />
              </button>
            </div>

            {editingModule && (
              <form onSubmit={handleUpdateModule} className="drawer-form">
                <div className="drawer-tabs">
                  <button type="button" className={editModalTab === 'basic' ? 'active' : ''} onClick={() => setEditModalTab('basic')}>Basic Info</button>
                  <button type="button" className={editModalTab === 'team' ? 'active' : ''} onClick={() => setEditModalTab('team')}>Module Team</button>
                </div>

                {editModalTab === 'basic' ? (
                  <div className="form-stack">
                    <div className="input-group">
                      <label>Module Name</label>
                      <input type="text" value={editingModule.name} onChange={e => setEditingModule({...editingModule, name: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label>Module Leader</label>
                      <select value={editingModule.leaderId} onChange={e => setEditingModule({...editingModule, leaderId: e.target.value})}>
                        {lecturers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="team-list-container">
                    <label>Select Lecturers</label>
                    <div className="scroll-area">
                      {lecturers.map(l => (
                        l._id !== editingModule.leaderId && (
                          <div key={l._id} className="team-item-card">
                            <input type="checkbox" checked={editingModule.moduleTeam.includes(l._id)} onChange={() => handleToggleTeamMember(l._id)} />
                            <div className="item-detail">
                              <span className="name">{l.name}</span>
                              <span className="email">{l.email}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                <div className="drawer-footer">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => setEditingModule(null)}>Cancel</button>
                </div>
              </form>
            )}

            {editingSociety && (
              <form onSubmit={handleUpdateSociety} className="drawer-form">
                <div className="form-stack">
                  <div className="input-group">
                    <label>Society Name</label>
                    <input type="text" value={editingSociety.name} onChange={e => setEditingSociety({...editingSociety, name: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Description</label>
                    <textarea rows="3" value={editingSociety.description} onChange={e => setEditingSociety({...editingSociety, description: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Leader (Student)</label>
                    <select value={editingSociety.leaderId} onChange={e => setEditingSociety({...editingSociety, leaderId: e.target.value})}>
                      {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="drawer-footer">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" className="cancel-btn" onClick={() => setEditingSociety(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
