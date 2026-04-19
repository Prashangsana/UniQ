import React, { useState, useEffect } from "react";
import "./DashboardView.css";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import MentorModal from "./MentorModal";

const DashboardView = ({ onSeeAll, onSeeEvents, onMentorSelect }) => {
  const navigate = useNavigate();
  const [showMentorModal, setShowMentorModal] = React.useState(false);
  const userRole = localStorage.getItem('user_role');
  const isPeerMentor = localStorage.getItem('is_peer_mentor') === 'true';

  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        setLoadingGroups(true);
        const response = await fetch(`${API_URL}/api/groups/my`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setMyGroups(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchMyGroups();
  }, [API_URL]);

  const handleSelectRole = async (role) => {
    setShowMentorModal(false);

    if (role === 'peer' && !isPeerMentor) {
      try {
        // FIX 8: credentials: 'include' was missing — req.user was always undefined on the backend
        const response = await fetch(`${API_URL}/api/mentoring/register-peer`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          console.log("Peer Mentor status activated.");
          localStorage.setItem('is_peer_mentor', 'true');
        } else {
          console.error("Registration failed:", data.message);
        }
      } catch (err) {
        console.error("Failed to register peer mentor status:", err);
      }
    }

    if (onMentorSelect) {
      onMentorSelect(role === 'peer' ? 'peer-dashboard-view' : 'lecturer-dashboard-view');
    } else {
      navigate(`/mentor-auth/${role}`);
    }
  };

  return (
    <div className="app-inner-container">
      <header className="hero-banner">
        <div className="qr-code-placeholder">
          <div style={{ background: "white", padding: "8px", borderRadius: "8px" }}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Ticket" alt="QR" />
          </div>
        </div>
        <div className="hero-content">
          <p className="hero-subtitle">Phase 02 tickets available on spotseeker.lk</p>
          <h1 className="event-title">Sally's Manor</h1>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="content-panel groups-panel">
          <div className="section-header">
            <h3>My Groups</h3>
            <button className="see-all" onClick={onSeeAll}>See All &gt;</button>
          </div>

          <div className="dashboard-quick-stats">
            <div className="stat-item">
              <span className="stat-value">{myGroups.length}</span>
              <span className="stat-label">Active Groups</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">2</span>
              <span className="stat-label">Tasks Due</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5</span>
              <span className="stat-label">New Messages</span>
            </div>
          </div>

          <div className="gf-grid main-dash-grid">
            {loadingGroups ? (
              <div className="loading-shimmer">Loading...</div>
            ) : myGroups.length > 0 ? (
              myGroups.map((group) => (
                <div
                  key={group._id}
                  className="gf-card-visual dash-large"
                  onClick={() => onSeeAll()}
                >
                  <img
                    src={group.img || 'https://varthana.com/school/wp-content/uploads/2023/08/B512.jpg'}
                    alt={group.name}
                  />
                  <div className="gf-card-gradient">
                    <div className="gf-card-title">{group.name}</div>
                    <div className="gf-card-sub">{group.domain || "Project Collaboration"}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-card">
                <Icon icon="lucide:plus-circle" width="40" color="#cbd5e1" />
                <p>No groups yet? Start your journey here.</p>
                <button className="gf-btn-primary" onClick={onSeeAll}>Explore Modules</button>
              </div>
            )}
          </div>
        </section>

        <aside className="content-panel sidebar-panel">
          <div className="tiles-grid">
            <button className="tile-btn blue">
              <span className="icon"><Icon icon="lucide:calendar-days" width="32" /></span> Bookings
            </button>
            <button className="tile-btn blue">
              <span className="icon"><Icon icon="lucide:users" width="32" /></span> Community
            </button>
            <button className="tile-btn blue">
              <span className="icon"><Icon icon="lucide:trophy" width="32" /></span> Rankings
            </button>
            <button className="tile-btn blue" onClick={onSeeEvents}>
              <span className="icon"><Icon icon="lucide:ticket" width="32" /></span> Events
            </button>
          </div>

          <div className="register-stack">
            {!isPeerMentor && userRole !== 'lecturer' && (
              <button className="register-btn" onClick={() => setShowMentorModal(true)}>
                <div className="reg-content">
                  <span className="reg-title">Register as a Mentor</span>
                  <span className="reg-sub">Share your knowledge</span>
                </div>
                <span className="arrow">→</span>
              </button>
            )}

            <button className="register-btn">
              <div className="reg-content">
                <span className="reg-title">Register as a Society Leader</span>
                <span className="reg-sub">Lead a society</span>
              </div>
              <span className="arrow">→</span>
            </button>
          </div>
        </aside>
      </div>

      {showMentorModal && (
        <MentorModal
          onClose={() => setShowMentorModal(false)}
          onSelectRole={handleSelectRole}
        />
      )}
    </div>
  );
};

export default DashboardView;