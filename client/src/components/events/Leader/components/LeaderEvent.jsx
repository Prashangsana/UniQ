import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LeaderEvent.css";

// 1. Admin Event Banner
export const LeaderEventBanner = ({ large, id = "sample-event" }) => {
  const navigate = useNavigate();
  return (
    <div 
      className={`leader-banner ${large ? "large" : ""}`} 
      onClick={() => navigate(`/event/${id}`)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="leader-banner-text">
        {id.replace(/-/g, ' ').toUpperCase()}
      </div>
      <div className="leader-edit-badge">✏️ Edit</div>
    </div>
  );
};

// 2. Admin Event Row
export const LeaderEventRow = ({ title, events = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? events : events.slice(0, 3);

  return (
    <section className="leader-row">
      <div className="leader-row-header">
        <h2>{title}</h2>
        {events.length > 3 && (
          <button className="leader-more-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "View All Stats >"}
          </button>
        )}
      </div>
      <div className="leader-row-grid">
        {events.length === 0 ? (
          <div className="leader-empty">No active events found in this category.</div>
        ) : (
          displayItems.map((id, index) => <LeaderEventBanner key={index} id={id} />)
        )}
      </div>
    </section>
  );
};

// 3. Admin Sidebar (Analytics focus)
export const LeaderSidebar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="leader-sidebar">
      <h3 className="leader-sidebar-title">{title}</h3>
      <div className="leader-sidebar-items">
        {[0, 1, 2].map((i) => (
          <div key={i} className="leader-stat-card" onClick={() => navigate(`/event/top-${i}`)}>
            <div className="leader-stat-info">
              <span>Top Event {i + 1}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="leader-sidebar-btn" onClick={() => navigate('/report')}>
        Weekly Report &gt;
      </button>
    </div>
  );
};

// 4. Admin Society Card
export const LeaderSocietyCard = ({ name, id }) => {
  return (
    <Link to={`/society/${id}`} className="leader-card-link">
      <div className="leader-card">
        <div className="leader-card-logo">Logo</div>
        <span className="leader-card-name">{name}</span>
        <div className="leader-manage-tag">✏️ Manage</div>
      </div>
    </Link>
  );
};