import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './SettingsView.css';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const [toggles, setToggles] = useState({
    collab: true,
    mentor: false,
    events: true,
    groups: true,
  });

  const [skills, setSkills] = useState(['React', 'Python', 'UI Design', 'Java']);
  const [newSkill, setNewSkill] = useState('');

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const addSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="settings-layout">
        
        {/* --- SIDEBAR --- */}
        <aside className="settings-sidebar-wrapper">
          <nav className="settings-sidebar">
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
              <Icon icon="lucide:user" width="18" /> Public Profile
            </button>
            <button className={activeTab === 'matching' ? 'active' : ''} onClick={() => setActiveTab('matching')}>
              <Icon icon="lucide:brain-circuit" width="18" /> Skill Matching
            </button>
            <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
              <Icon icon="lucide:bell" width="18" /> Notifications
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <Icon icon="lucide:shield" width="18" /> Security
            </button>
          </nav>

          <div className="sidebar-widget">
            <h4>Profile Completion</h4>
            <div className="progress-bar"><div className="progress-fill" style={{width: '75%'}}></div></div>
            <p>75% Complete. Add your GitHub link to reach 85%.</p>
          </div>
        </aside>

        {/* --- CONTENT --- */}
        <div className="settings-content">
          
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <div className="content-grid-2-1">
              <div className="settings-card main-card">
                <h3>Personal Information</h3>
                <div className="profile-pic-section">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="settings-avatar" />
                  <div className="pic-actions">
                    <button className="btn-primary">Change</button>
                    <button className="btn-secondary">Remove</button>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Alex Morgan" />
                  </div>
                  <div className="input-group">
                    <label>Username</label>
                    <input type="text" defaultValue="@alex_cs" />
                  </div>
                  <div className="input-group full-width">
                    <label>Bio</label>
                    <textarea rows="4" defaultValue="Computer Science freshman passionate about web dev and AI. Always looking for study partners!" />
                  </div>
                </div>
                <button className="btn-save">Save Profile Details</button>
              </div>

              <div className="side-card-stack">
                <div className="settings-card side-card">
                  <h3>Academic Info</h3>
                  <div className="input-group">
                    <label>Major</label>
                    <input type="text" defaultValue="Computer Science" disabled />
                  </div>
                  <div className="input-group mt-15">
                    <label>Graduation Year</label>
                    <input type="text" defaultValue="2027" />
                  </div>
                </div>
                <div className="settings-card side-card">
                  <h3>Social Links</h3>
                  <div className="input-group with-icon">
                    <Icon icon="lucide:github" className="input-icon" />
                    <input type="text" placeholder="github.com/username" />
                  </div>
                  <div className="input-group with-icon mt-15">
                    <Icon icon="lucide:linkedin" className="input-icon" />
                    <input type="text" placeholder="linkedin.com/in/username" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SKILL MATCHING SECTION */}
          {activeTab === 'matching' && (
            <div className="content-grid-1-1">
              <div className="settings-card">
                <h3>Collaboration Toggles</h3>
                <div className="toggle-group">
                  <div className="toggle-info">
                    <h4>Open to Collaborations</h4>
                    <p>Let others invite you to new study groups.</p>
                  </div>
                  <label className="switch"><input type="checkbox" checked={toggles.collab} onChange={() => handleToggle('collab')} /><span className="slider round"></span></label>
                </div>
                <div className="toggle-group">
                  <div className="toggle-info">
                    <h4>Mentorship</h4>
                    <p>Indicate that you are available to mentor juniors.</p>
                  </div>
                  <label className="switch"><input type="checkbox" checked={toggles.mentor} onChange={() => handleToggle('mentor')} /><span className="slider round"></span></label>
                </div>
              </div>

              <div className="settings-card">
                <h3>My Top Skills</h3>
                <p className="sub-text">These skills help us match you with the right study groups.</p>
                <div className="tags-input-container">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill} <button onClick={() => removeSkill(skill)} className="remove-tag"><Icon icon="lucide:x" width="14" /></button>
                    </span>
                  ))}
                  <input type="text" placeholder="Type a skill and press Enter..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={addSkill} className="tag-input" />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeTab === 'notifications' && (
            <div className="settings-card full-card">
              <h3>Notification Preferences</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Event Reminders</h4>
                  <p>Get notified 24 hours before your booked events.</p>
                </div>
                <label className="switch"><input type="checkbox" checked={toggles.events} onChange={() => handleToggle('events')} /><span className="slider round"></span></label>
              </div>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Group Activity</h4>
                  <p>Notifications for new messages and tasks in your groups.</p>
                </div>
                <label className="switch"><input type="checkbox" checked={toggles.groups} onChange={() => handleToggle('groups')} /><span className="slider round"></span></label>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === 'security' && (
            <div className="content-grid-2-1">
              <div className="settings-card">
                <h3>Change Password</h3>
                <div className="input-group full-width mb-20">
                  <label>Email Address</label>
                  <input type="email" defaultValue="w1234567@my.westminster.ac.uk" disabled />
                  <span className="verified-badge">✓ Verified</span>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <button className="btn-save">Update Password</button>
              </div>

              <div className="settings-card danger-card">
                <h3>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. This will erase all your group data, skills, and bookings.</p>
                <button className="btn-danger mt-15">Delete Account</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;