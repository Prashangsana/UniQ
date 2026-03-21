import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './SettingsView.css';

const SettingsView = () => {
  // Tab State
  const [activeTab, setActiveTab] = useState('matching');

  // Toggle States
  const [toggles, setToggles] = useState({
    collab: true,
    mentor: false,
    seekMentor: true,
    events: true,
    groups: true,
    mentorshipReq: true,
    updates: false,
    emailNotif: true,
    pushNotif: false,
  });

  const [preferences, setPreferences] = useState({
    role: 'Frontend Developer',
    level: 'Intermediate'
  });

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const handlePreferenceChange = (key, value) => setPreferences(prev => ({ ...prev, [key]: value }));

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your matching preferences and notification triggers.</p>
      </div>

      {/* --- HORIZONTAL TABS --- */}
      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'matching' ? 'active' : ''}`}
          onClick={() => setActiveTab('matching')}
        >
          <Icon icon="lucide:brain-circuit" width="20" /> Mentorship & Matching
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Icon icon="lucide:bell" width="20" /> Notifications
        </button>
      </div>

      <div className="settings-content-wrapper">
        
        {/* --- TAB 1: SKILL MATCHING & MENTORSHIP --- */}
        {activeTab === 'matching' && (
          <div className="tab-content fade-in-fast">
            <div className="settings-card">
              <h3>Collaboration Status</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Open to Collaborations</h4>
                  <p>Let others invite you to new study groups and projects.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.collab} onChange={() => handleToggle('collab')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Available to Mentor</h4>
                  <p>Allow juniors to request 1-on-1 guidance from you.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.mentor} onChange={() => handleToggle('mentor')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group border-none">
                <div className="toggle-info">
                  <h4>Looking for a Mentor</h4>
                  <p>Highlight your profile to available faculty and senior peers.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.seekMentor} onChange={() => handleToggle('seekMentor')} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <h3>Match Preferences</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label>Primary Focus</label>
                  <select 
                    className="select-input" 
                    value={preferences.role} 
                    onChange={(e) => handlePreferenceChange('role', e.target.value)}
                  >
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist / AI</option>
                    <option>UI/UX Designer</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Experience Level</label>
                  <select 
                    className="select-input" 
                    value={preferences.level} 
                    onChange={(e) => handlePreferenceChange('level', e.target.value)}
                  >
                    <option>Beginner (Year 1)</option>
                    <option>Intermediate (Year 2)</option>
                    <option>Advanced (Year 3/4)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: NOTIFICATIONS --- */}
        {activeTab === 'notifications' && (
          <div className="tab-content fade-in-fast">
            <div className="settings-card">
              <h3>Event Triggers</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Event Reminders</h4>
                  <p>Get notified 24 hours before your booked events or sessions.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.events} onChange={() => handleToggle('events')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Group Activity</h4>
                  <p>Alerts for new messages, tasks, and files in your study groups.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.groups} onChange={() => handleToggle('groups')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Mentorship Requests</h4>
                  <p>Alerts when someone accepts, declines, or requests a session.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.mentorshipReq} onChange={() => handleToggle('mentorshipReq')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group border-none">
                <div className="toggle-info">
                  <h4>Platform Updates</h4>
                  <p>News about new UniQ features, maintenance, and updates.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.updates} onChange={() => handleToggle('updates')} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <h3>Delivery Methods</h3>
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Send daily summaries to your university email.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-group border-none">
                <div className="toggle-info">
                  <h4>Browser Push Notifications</h4>
                  <p>Receive instant pop-ups while the app is closed.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={toggles.pushNotif} onChange={() => handleToggle('pushNotif')} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="save-action-container">
           <button className="btn-save" onClick={() => alert('Settings Saved!')}>
             Save All Preferences
           </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;