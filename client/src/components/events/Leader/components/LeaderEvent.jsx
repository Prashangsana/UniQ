import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LeaderEvent.css";

// 1. Admin Event Banner
export const LeaderEventBanner = ({ large, id = "sample-event", title }) => {
  const navigate = useNavigate();
  const displayTitle = title || id.replace(/-/g, ' ').toUpperCase();
  
  return (
    <div 
      className={`leader-banner ${large ? "large" : ""}`} 
      onClick={() => navigate(`/admin/event/${id}`)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="leader-banner-text">
        {displayTitle}
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
            {showAll ? "Show less" : "Student Dashboard >"}
          </button>
        )}
      </div>
      <div className="leader-row-grid">
        {events.length === 0 ? (
          <div className="leader-empty">No active events found in this category.</div>
        ) : (
          displayItems.map((event, index) => {
            const eventId = typeof event === 'string' ? event : event._id;
            const eventTitle = typeof event === 'string' ? null : event.title;
            return <LeaderEventBanner key={index} id={eventId} title={eventTitle} />;
          })
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
      
      <button className="leader-sidebar-btn" onClick={() => navigate('/dashboard')}>
        Student Dashboard &gt;
      </button>
    </div>
  );
};

// 4. Admin Society Card
export const LeaderSocietyCard = ({ name, id }) => {
  return (
    <Link to={`/admin/society/${id}`} className="leader-card-link">
      <div className="leader-card">
        <img
          src={logo || `/images-e/societies/${id}.png`}
          alt={name}
          className="leader-card-logo"
          onError={(e) => { e.target.src = "/images-e/default.jpg"; }}
        />
        <span className="leader-card-name">{name}</span>
        <div className="leader-manage-tag">✏️ Manage</div>
>>>>>>> yahani
      </div>
    </Link>
  );
};