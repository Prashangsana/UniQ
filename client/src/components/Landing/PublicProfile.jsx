import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Profile.css';

const PublicProfile = ({ id: propId }) => {
  const { id: urlId } = useParams(); // Extracts the ID from the URL 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = propId || urlId;

  useEffect(() => {
    if (!id) return;
    const fetchPublicProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/public-profile/${id}`);
        const result = await response.json();

        if (result.success) {
          setUser(result.data);
        } else {
          setError(result.message || "User not found.");
        }
      } catch (err) {
        setError("Could not connect to the server. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (error) return <div className="error-screen">{error}</div>;
  if (!user) return null;

  const isLecturer = user.role === 'lecturer';
  const config = {
    academicLabel: isLecturer ? "Education & Qualifications" : "Course Name",
    groupLabel: isLecturer ? "Department" : "Academic Group",
    skillsLabel: isLecturer ? "Expertise Areas" : "My Skills",
    modulesLabel: isLecturer ? "Modules Taught" : "Modules",
  };

  if (!user) {
    return <div className="loading">Loading Profile...</div>;
}

  const userAvatar = user.profileImage || user.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;

  return (
    <div className="profile-container fade-in">
      {/* SIDEBAR - READ ONLY VERSION */}
      <aside className="profile-sidebar">
        <div className="avatar-wrapper-lg">
          <img 
            src={userAvatar} alt="Profile" className="large-avatar"
          />
          
        </div>

        <div className="sidebar-names">
          <h1>{user.name}</h1>
          <p className="username">@{user.username || 'username'}</p>
          <p className="user-email">{user.email}</p>
        </div>

      
       <div className="sidebar-socials-circular">
          <a href={user.socials?.instagram || "#"} target="_blank" rel="noreferrer" className="social-circle-btn">
            <Icon icon="lucide:instagram" />
          </a>
          <a href={user.socials?.github || "#"} target="_blank" rel="noreferrer" className="social-circle-btn">
            <Icon icon="lucide:github" />
          </a>
          <a href={user.socials?.linkedin || "#"} target="_blank" rel="noreferrer" className="social-circle-btn">
            <Icon icon="lucide:linkedin" />
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT - VIEW ONLY */}
      <main className="profile-main-content">
        <section className="intro-card">
          <div className="intro-body">
            <div className="content-wrapper">
              <div className="greeting-section">
                <h2>Hi there 👋, I'm {user.name}</h2>
                <p className="main-bio-text">{user.bio}</p>
              </div>

              <div className="academic-details">
                <p><span className="label">{config.academicLabel}:</span>{isLecturer ? user.education : user.course}</p>
                <p><span className="label">{config.groupLabel}:</span> {isLecturer ? user.department : user.group}</p>
                
                {user.modules && user.modules.length > 0 && (
                  <div className="learning-section">
                    <span className="label">{config.modulesLabel}:</span>
                    <ul className="modules-list">
                      {user.modules?.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="content-divider"></div>

              <div className="about-section">
                <h3>🌸 About Me</h3>
                <p>{user.aboutMe}</p>
              </div>

              {user.skills && user.skills.length > 0 && (
                <div className="skills-section">
                  <h3>✨{config.skillsLabel}</h3>
                  <div className="skills-grid">
                    {user.skills?.map((s, i) => (
                      <div key={i} className="skill-pill-light">{s}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicProfile;