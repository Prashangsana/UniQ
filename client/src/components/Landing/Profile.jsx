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
  const [modulesInput, setModulesInput] = useState('');

  // select skills 
  const PREDEFINED_SKILLS = ["React", "Node.js", "Java", "Python", "UI/UX Design", "SQL", "Figma", "TypeScript", "JavaScript", "C++", "Other"];
  const [selectedSkill, setSelectedSkill] = useState('');
  const [otherSkill, setOtherSkill] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);


  // --- STAGE 1 & 3: FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile',
          //*
          {credentials:'include'});
        const result = await response.json();

        if (result.success) {
          const data =result.data;
          setUser({
            ...data,
          skills: data.skills || [],
          modules: data.modules || []
          });
         
          setModulesInput(result.data.modules ? result.data.modules.join(', ') : '');
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Could not connect to the server. Make sure your Node backend is running on port 5000.");
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

// --- NEW SKILL METHODS ---
  const handleSkillSelectChange = (e) => {
    const val = e.target.value;
    setSelectedSkill(val);
    setShowOtherInput(val === "Other");
  };

  const addSkill = () => {
    const skillToAdd = selectedSkill === "Other" ? otherSkill.trim() : selectedSkill;
    if (skillToAdd && !user.skills.includes(skillToAdd)) {
      setUser({ ...user, skills: [...user.skills, skillToAdd] });
      setSelectedSkill('');
      setOtherSkill('');
      setShowOtherInput(false);
    }
  };

  const removeSkill = (skillToRemove) => {
    setUser({ ...user, skills: user.skills.filter(s => s !== skillToRemove) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
    reader.onloadend = () => {
      // This converts the image to a long string (Base64)
      setUser({ ...user, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  }
};

  const handleSave = async (e) => {
    e.preventDefault();
    // Convert strings back to arrays
    
    const updatedModules = modulesInput.split(',').map(m => m.trim()).filter(m => m !== "");
    
    const updatedData = { 
      ...user, 
      
      modules: updatedModules 
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        //*
        credentials:'include',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        localStorage.setItem('user_name', result.data.name);
        localStorage.setItem('user_photo', result.data.profileImage || result.data.photo ||"");
        window.dispatchEvent(new Event("storage"));
        
        setIsEditing(false);
        alert("Profile Updated Successfully ");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to save changes.");
    }
  };

  

/* --- CHANGE: ADD FALLBACK IMAGE LOGIC --- */

if (loading) return <div className="loading-screen">Loading Profile...</div>;
if (error) return <div className="error-screen">{error}</div>;
if (!user) return null;

const userAvatar = user.profileImage || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
 
  return (
    <div className="profile-container fade-in">
      <aside className="profile-sidebar">
        <div className="avatar-wrapper-lg" onClick={() => fileInputRef.current.click()}>
          
          <img src={userAvatar} alt="Profile" className="large-avatar" />
          <div className="status-emoji">
            <Icon icon="lucide:camera" />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
        </div>

        <div className="sidebar-names">
          <h1>{user.name}</h1>
          
          {/* --- CHANGE: ADD DYNAMIC ROLE TAG --- */}
          <p className="role-tag-badge">
            {user.role === 'lecturer' ? 'University Lecturer' : 'Student Member'}
          </p>

          <p className="username">@{user.username || 'username'}</p>
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
                    {/* --- NEW SKILLS SELECTOR UI --- */}
                  <div className="form-group">
                    <label>Skills</label>
                    <div className="skills-tag-editor">
                      {user.skills.map((skill, index) => (
                        <div key={index} className="skill-tag">
                          {skill}
                          <Icon icon="lucide:x" onClick={() => removeSkill(skill)} className="remove-tag-icon" />
                        </div>
                      ))}
                    </div>
                    <div className="skill-input-row">
                      <select value={selectedSkill} onChange={handleSkillSelectChange} className="skill-select">
                        <option value="">Choose a skill...</option>
                        {PREDEFINED_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {showOtherInput && (
                        <input 
                          placeholder="Type skill..." 
                          value={otherSkill}
                          onChange={(e) => setOtherSkill(e.target.value)}
                          className="other-skill-input"
                        />
                      )}
                      <button type="button" onClick={addSkill} className="btn-add-skill">Add</button>
                    </div>
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
