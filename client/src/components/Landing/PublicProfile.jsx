import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './Profile.css';

const PublicProfile = () => {
  const { id } = useParams(); // Extracts the ID from the URL 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  if (!user) {
    return <div className="loading">Loading Profile...</div>;
}

  return (
    <div className="profile-container fade-in">
      {/* SIDEBAR - READ ONLY VERSION */}
      <aside className="profile-sidebar">
        <div className="avatar-wrapper-lg">
          <img 
            src={user.profileImage || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="large-avatar" 
          />
          
        </div>

        <div className="sidebar-names">
          <h1>{user.name}</h1>
          <p className="username">@{user.username}</p>
          <p className="user-email">{user.email}</p>
        </div>

        

        <div className="sidebar-socials-circular">
          <a href="#" className="social-circle-btn"><Icon icon="lucide:instagram" /></a>
          <a href="#" className="social-circle-btn"><Icon icon="lucide:github" /></a>
          <a href="#" className="social-circle-btn"><Icon icon="lucide:linkedin" /></a>
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
                <p><span className="label">Course:</span> {user.course}</p>
                <p><span className="label">Group:</span> {user.group}</p>
                
                {user.modules && user.modules.length > 0 && (
                  <div className="learning-section">
                    <span className="label">Modules:</span>
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
                  <h3>✨ My Skills</h3>
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