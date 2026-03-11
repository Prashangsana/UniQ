import React, { useState, useRef,useEffect } from 'react';
import { Icon } from '@iconify/react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);//
  const [error, setError] = useState(null);//
  const fileInputRef = useRef(null);

  

  // Initialize with null - data will come from your userMock.js via the Controller
  const [user, setUser] = useState(null);

  // Local state for comma-separated inputs
  const [skillsInput, setSkillsInput] = useState('');
  const [modulesInput, setModulesInput] = useState('');

  // --- STAGE 1 & 3: FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile');
        const result = await response.json();

        if (result.success) {
          setUser(result.data);
          // Sync the comma-separated strings with the arrays from backend
          setSkillsInput(result.data.skills ? result.data.skills.join(', ') : '');
          setModulesInput(result.data.modules ? result.data.modules.join(', ') : '');
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Could not connect to the server. Make sure your Node backend is running on port 5000.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setUser({ ...user, [name]: value });
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profileImage: URL.createObjectURL(file) });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Convert strings back to arrays
    const updatedSkills = skillsInput.split(',').map(s => s.trim()).filter(s => s !== "");
    const updatedModules = modulesInput.split(',').map(m => m.trim()).filter(m => m !== "");
    
    const updatedData = { 
      ...user, 
      skills: updatedSkills, 
      modules: updatedModules 
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data); // Update UI with the data returned from mockUser update
        setIsEditing(false);
        alert("Profile Updated Successfully (Mock Data)!");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to save changes.");
    }
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="profile-container fade-in">
      <aside className="profile-sidebar">
        <div className="avatar-wrapper-lg" onClick={() => fileInputRef.current.click()}>
          <img src={user.profileImage} alt="Profile" className="large-avatar" />
          <div className="status-emoji"><Icon icon="lucide:camera" /></div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
        </div>

        <div className="sidebar-names">
          <h1>{user.name}</h1>
          <p className="username">@{user.username}</p>
          <p className="user-email">{user.email}</p>
        </div>

        <button className={`btn-edit-profile ${isEditing ? 'active-edit' : ''}`} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>

        <div className="sidebar-socials-circular">
          <a href="#" className="social-circle-btn"><Icon icon="lucide:instagram" /></a>
          <a href="#" className="social-circle-btn"><Icon icon="lucide:github" /></a>
          <a href="#" className="social-circle-btn"><Icon icon="lucide:linkedin" /></a>
        </div>
      </aside>

      <main className="profile-main-content">
        <section className="intro-card">
          <div className="intro-body">
            {!isEditing ? (
              /* VIEW MODE */
              <div className="content-wrapper">
                <div className="greeting-section">
                  <h2>Hi there 👋, I'm {user.name}</h2>
                  <p className="main-bio-text">{user.bio}</p>
                </div>
                <div className="academic-details">
                  <p><span className="label">Course:</span> {user.course}</p>
                  <p><span className="label">Group:</span> {user.group}</p>
                  <div className="learning-section">
                    <span className="label">Modules:</span>
                    <ul className="modules-list">
                      {user.modules.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="content-divider"></div>
                <div className="about-section">
                  <h3>🌸 About Me</h3>
                  <p>{user.aboutMe}</p>
                </div>
                <div className="skills-section">
                  <h3>✨ My Skills</h3>
                  <div className="skills-grid">
                    {user.skills.map((s, i) => <div key={i} className="skill-pill-light">{s}</div>)}
                  </div>
                </div>
              </div>
            ) : (
              /* FULL EDIT MODE */
              <div className="content-wrapper">
                <h2 className="edit-header">Update Profile ✨</h2>
                <form className="edit-form" onSubmit={handleSave}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input name="name" value={user.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Username</label>
                      <input name="username" value={user.username} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input name="email" value={user.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Academic Group</label>
                      <input name="group" value={user.group} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Course Name</label>
                    <input name="course" value={user.course} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Short Bio</label>
                    <input name="bio" value={user.bio} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>About Me</label>
                    <textarea name="aboutMe" rows="3" value={user.aboutMe} onChange={handleChange}></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Modules (comma separated)</label>
                      <input value={modulesInput} onChange={(e) => setModulesInput(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Skills (comma separated)</label>
                      <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" className="btn-save-profile">Save All Changes</button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
