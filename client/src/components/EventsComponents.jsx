import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./EventsComponents.css";

// --- EVENT BANNER ---
export const EventBanner = ({ large, id = "sample-event", image }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`event-banner ${large ? "large" : ""}`}
      onClick={() => navigate(`/event/${id}`)}
      style={{ backgroundImage: `url(${image || "/images-e/default.jpg"})` }}
    />
  );
};

// --- SOCIETY CARD ---
export const SocietyCard = ({ name }) => {
  const urlName = name.replace(/\s+/g, "-").toLowerCase();
  return (
    <Link to={`/society/${urlName}`} className="society-card-link">
      <div className="society-card">
        <img
          src={`/images-e/societies/${urlName}.png`}
          alt={name}
          className="society-logo"
          onError={(e) => { e.target.src = "/images-e/default.jpg"; }}
        />
        <span>{name}</span>
      </div>
    </Link>
  );
};

// --- EVENT ROW ---
export const EventRow = ({ title, addedEvents = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const isMyEventsRow = title === "My events";

  const getDisplayItems = () => {
    if (isMyEventsRow) {
      return showAll ? addedEvents : addedEvents.slice(0, 3);
    }
    return Array(showAll ? 6 : 3).fill(0);
  };

  const displayItems = getDisplayItems();

  return (
    <section className="event-row">
      <div className="row-header">
        <h2>{title}</h2>
        {(isMyEventsRow ? addedEvents.length > 3 : true) && (
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "More >"}
          </button>
        )}
      </div>
      <div className="row-content">
        {isMyEventsRow && addedEvents.length === 0 ? (
          <div className="empty-state">
            <p>No events added to your schedule yet.</p>
          </div>
        ) : (
          displayItems.map((item, index) => (
            <EventBanner
              key={index}
              id={isMyEventsRow ? item : `recommended-${index}`}
              image={`/images-e/event${index + 1}.jpg`}
            />
          ))
        )}
      </div>
    </section>
  );
};

// --- SIDEBAR SECTION ---
export const SidebarSection = ({ title }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const items = Array(showAll ? 5 : 3).fill(0);

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-title">{title}</h3>
      <div className="sidebar-items">
        {items.map((_, index) => (
          <div
            key={index}
            className="sidebar-event-card"
            onClick={() => navigate(`/event/top-event-${index}`)}
          >
            <div
              className="sidebar-card-banner"
              style={{ backgroundImage: `url(/images-e/top${index + 1}.jpg)` }}
            />
          </div>
        ))}
      </div>
      <button className="sidebar-view-more" onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show less" : "More >"}
      </button>
    </div>
  );
};