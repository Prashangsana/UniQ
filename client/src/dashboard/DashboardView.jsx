import React from "react";
import "./DashboardView.css";
import { Icon } from "@iconify/react";

const groupsData = [
  { id: 1, name: "CS - 97", img: "/images-d/gp.jpg" },
  { id: 2, name: "Design Club", img: "/images-d/design.jpg" },
  { id: 3, name: "Robotics", img: "/images-d/robotics.jpg" },
  { id: 4, name: "AI Research", img: "/images-d/ai.png" },
  { id: 5, name: "Game Dev", img: "/images-d/gd.jpg" },
  { id: 6, name: "Machine Learning", img: "/images-d/ml.jpg" },
];

const DashboardView = () => {
  return (
    <div className="app-inner-container">
      {/* Hero Banner */}
      <header className="hero-banner">
        <div className="qr-code-placeholder">
          <div
            style={{ background: "white", padding: "8px", borderRadius: "8px" }}
          >
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Ticket"
              alt="QR"
            />
          </div>
        </div>

        <div className="hero-content">
          <p className="hero-subtitle">
            Phase 02 tickets available on spotseeker.lk
          </p>
          <h1 className="event-title">Sally's Manor</h1>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: Groups */}
        <section className="content-panel groups-panel">
          <div className="section-header">
            <h3>My Groups</h3>
            <button className="see-all">See All &gt;</button>
          </div>

          <div className="groups-grid">
            {groupsData.map((group) => (
              <div key={group.id} className="group-card">
                <img src={group.img} alt={group.name} />
                <div className="group-gradient">
                  <span>{group.name}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="view-more-btn">Explore New Groups</button>
        </section>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="content-panel sidebar-panel">
          <div className="tiles-grid">
            <button className="tile-btn blue">
              <span className="icon">
                <Icon icon="lucide:calendar-days" width="32" />
              </span>{" "}
              Bookings
            </button>
            <button className="tile-btn blue">
              <span className="icon">
                <Icon icon="lucide:users" width="32" />
              </span>{" "}
              Community
            </button>
            <button className="tile-btn blue">
              <span className="icon">
                <Icon icon="lucide:trophy" width="32" />
              </span>{" "}
              Rankings
            </button>
            <button className="tile-btn blue">
              <span className="icon">
                <Icon icon="lucide:ticket" width="32" />
              </span>{" "}
              My Events
            </button>
          </div>

          <div className="register-stack">
            <button className="register-btn">
              <div className="reg-content">
                <span className="reg-title">Register as a Mentor</span>
                <span className="reg-sub">Share your knowledge</span>
              </div>
              <span className="arrow">→</span>
            </button>

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
    </div>
  );
};

export default DashboardView;
