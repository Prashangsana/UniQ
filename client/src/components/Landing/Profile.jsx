import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [user, setUser] = useState(null);
  const [availableModules, setAvailableModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');

  // Select skills
  const PREDEFINED_SKILLS = ["React", "Node.js", "Java", "Python", "UI/UX Design", "SQL", "Figma", "TypeScript", "JavaScript", "C++", "Other"];
  const [selectedSkill, setSelectedSkill] = useState('');
  const [otherSkill, setOtherSkill] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const isLecturer = user?.role === 'lecturer';

  const config = {
    academicLabel: isLecturer ? "Education & Qualifications" : "Course Name",
    academicField: isLecturer ? "education" : "course",
    groupLabel: isLecturer ? "Department" : "Academic Group",
    groupField: isLecturer ? "department" : "group",
    skillsLabel: isLecturer ? "Expertise Areas" : "My Skills",
    modulesLabel: isLecturer ? "Modules Taught" : "Modules",
    predefinedList: isLecturer
      ? ["Artificial Intelligence", "Cyber Security", "Cloud Computing", "Software Architecture", "Data Science", "Machine Learning", "Other"]
      : ["React", "Node.js", "Java", "Python", "UI/UX Design", "SQL", "Figma", "TypeScript", "Other"]
  };

  useEffect(() => {
    const fetchProfileAndModules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', { credentials: 'include' });
        const result = await response.json();

        if (result.success) {
          const data = result.data;
          setUser({
            ...data,
            skills: data.skills || [],
            modules: data.modules || [],
            education: data.education || '',
            department: data.department || '',
            socials: data.socials || { instagram: '', github: '', linkedin: '' }
          });
        } else {
          setError(result.message);
        }

        const moduleRes = await fetch('http://localhost:5000/api/modules', { credentials: 'include' });
        const moduleResult = await moduleRes.json();
        if (moduleResult.success) {
          setAvailableModules(moduleResult.modules);
        }

      } catch (err) {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      socials: { ...user.socials, [name]: value }
    });
  };

  // NEW SKILL METHODS
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

  // NEW MODULE SELECTOR METHODS
  const addModule = () => {
    if (selectedModule && !(user.modules || []).includes(selectedModule)) {
      setUser({ ...user, modules: [...(user.modules || []), selectedModule] });
      setSelectedModule('');
    }
  };

  const removeModule = (moduleToRemove) => {
    setUser({ ...user, modules: user.modules.filter(m => m !== moduleToRemove) });
  };

  const handleImageChange = async (e) => {
    setShowPhotoMenu(false);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        setUser(prev => ({ ...prev, profileImage: base64Image }));

        try {
          const response = await fetch('http://localhost:5000/api/users/profile', {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, profileImage: base64Image }),
          });

          const result = await response.json();
          if (result.success) {
            localStorage.setItem('user_photo', base64Image);
            window.dispatchEvent(new Event("storage"));
            console.log("Avatar auto-saved successfully");
          }
        } catch (err) {
          console.error("Auto-save failed:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Removing the pfp
  const handleRemoveImage = async () => {
    setShowPhotoMenu(false);
    
    const updatedUser = { ...user, profileImage: "", photo: "" };
    setUser(updatedUser);

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        credentials: 'include',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.removeItem('user_photo');
        window.dispatchEvent(new Event("storage"));
        console.log("Avatar removed successfully");
      }
    } catch (err) {
      console.error("Remove avatar failed:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedData = { ...user };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        credentials: 'include',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        const finalPhoto = result.data.profileImage || result.data.photo || "";
        localStorage.setItem('user_name', result.data.name);
        localStorage.setItem('user_photo', finalPhoto);
        window.dispatchEvent(new Event("storage"));
        setIsEditing(false);
        alert("Profile Updated Successfully ");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to save changes.");
    }
  };

  /* ADD FALLBACK IMAGE LOGIC */

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!user) return null;

  const userAvatar = user.profileImage || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;

  return (
    <div className="profile-container fade-in">
      <aside className="profile-sidebar">
        <div className="avatar-wrapper-lg">
          <img src={userAvatar} alt="Profile" className="large-avatar" />
          
          <div className="status-emoji" onClick={() => setShowPhotoMenu(!showPhotoMenu)}>
            <Icon icon="lucide:pencil" />
          </div>

          {/* The Dropdown Menu */}
          {showPhotoMenu && (
            <div className="photo-edit-menu">
              <button 
                className="menu-btn" 
                onClick={() => {
                  setShowPhotoMenu(false);
                  fileInputRef.current.click();
                }}
              >
                Change Picture
              </button>
              <button 
                className="menu-btn remove-btn" 
                onClick={handleRemoveImage}
              >
                Remove Picture
              </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
            accept="image/*" 
          />
        </div>

        <div className="sidebar-names">
          <h1>{user.name}</h1>

          <p className="username">@{user.username || 'username'}</p>
          <p className="user-email">{user.email}</p>
        </div>

        <button 
          className={`btn-edit-profile ${isEditing ? 'active-edit' : ''}`} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>

        <div className="sidebar-socials-circular">
          <a
            href={user.socials?.instagram || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="social-circle-btn"
          >
            <Icon icon="lucide:instagram" />
          </a>
          <a
            href={user.socials?.github || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="social-circle-btn"
          >
            <Icon icon="lucide:github" />
          </a>
          <a
            href={user.socials?.linkedin || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="social-circle-btn"
          >
            <Icon icon="lucide:linkedin" />
          </a>
        </div>
      </aside>

      <main className="profile-main-content">
        <section className="intro-card">
          <div className="intro-body">
            {!isEditing ? (
              <div className="content-wrapper">
                <div className="greeting-section">
                  <h2>Hi there 👋, I'm {user.name}</h2>
                  <p className="main-bio-text">{user.bio}</p>
                </div>
                
                <div className="academic-details">
                  <p><span className="label">{config.academicLabel}:</span> {isLecturer ? user.education : user.course}</p>
                  <p><span className="label">{config.groupLabel}:</span> {isLecturer ? user.department : user.group}</p>
                  <div className="learning-section">
                    <span className="label">{config.modulesLabel}:</span>
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
                  <h3>✨ {config.skillsLabel}</h3>
                  <div className="skills-grid">
                    {user.skills.map((s, i) => <div key={i} className="skill-pill-light">{s}</div>)}
                  </div>
                </div>
              </div>
            ) : (
              // FULL EDIT MODE
              <div className="content-wrapper">
                <h2 className="edit-header">Update {isLecturer ? 'Lecturer' : 'Student'} Profile ✨</h2>
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
                      <input name="email" value={user.email} disabled className="disabled-input" />
                    </div>
                    <div className="form-group">
                      <label>{config.groupLabel}</label>
                      <input 
                        name={config.groupField}
                        value={user[config.groupField] || ''}
                        onChange={handleChange} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{config.academicLabel}</label>
                    <input 
                      name={config.academicField}
                      value={user[config.academicField] || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Bio</label>
                    <input name="bio" value={user.bio} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>About Me</label>
                    <textarea 
                      name="aboutMe" 
                      rows="3" 
                      value={user.aboutMe} 
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{config.modulesLabel}</label>

                      {/* Display selected modules as tags */}
                      <div className="skills-tag-editor">
                        {user.modules?.map((mod, index) => (
                          <div key={index} className="skill-tag">
                            {mod}
                            <Icon icon="lucide:x" onClick={() => removeModule(mod)} className="remove-tag-icon" />
                          </div>
                        ))}
                      </div>

                      {/* Dropdown to add new modules */}
                      <div className="skill-input-row">
                        <select
                          value={selectedModule}
                          onChange={(e) => setSelectedModule(e.target.value)}
                          className="skill-select"
                        >
                          <option value="">Choose a module...</option>
                          {availableModules.map(mod => (
                            <option key={mod._id} value={mod.name}>
                              {mod.name} ({mod._id})
                            </option>
                          ))}
                        </select>
                        <button type="button" onClick={addModule} className="btn-add-skill">Add</button>
                      </div>
                    </div>

                    {/* NEW SKILLS SELECTOR UI */}
                    <div className="form-group">
                      <label>{config.skillsLabel}</label>
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
                          {config.predefinedList.map(s => <option key={s} value={s}>{s}</option>)}
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

                  {/* SOCIAL MEDIA SECTION */}
                  <div className="form-group">
                    <label>Social Media Profiles</label>
                    <div className="social-inputs-grid">
                      <div className="social-input-item">
                        <Icon icon="lucide:instagram" />
                        <input 
                          name="instagram" 
                          placeholder="Instagram URL" 
                          value={user.socials?.instagram || ''} 
                          onChange={handleSocialChange} 
                        />
                      </div>
                      <div className="social-input-item">
                        <Icon icon="lucide:github" />
                        <input 
                          name="github" 
                          placeholder="GitHub URL" 
                          value={user.socials?.github || ''} 
                          onChange={handleSocialChange} 
                        />
                      </div>
                      <div className="social-input-item">
                        <Icon icon="lucide:linkedin" />
                        <input 
                          name="linkedin" 
                          placeholder="LinkedIn URL" 
                          value={user.socials?.linkedin || ''} 
                          onChange={handleSocialChange} 
                        />
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