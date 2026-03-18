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
      style={{ 
        backgroundImage: `url(${image || "/images-e/default.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  );
};

// --- SOCIETY CARD ---
export const SocietyCard = ({ name, id }) => {
  return (
    <Link to={`/society/${id}`} className="society-card-link">
      <div className="society-card">
        <img
          src={`/images-e/societies/${id}.png`}
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
export const EventRow = ({ title, events = [], addedEvents = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const isMyEventsRow = title === "My events";

  const getDisplayItems = () => {
    const list = isMyEventsRow ? addedEvents : events;
    if (isMyEventsRow) {
      return showAll ? list : list.slice(0, 3);
    }
    // For other rows, limit to 6 total as per requirements
    const limit = showAll ? 6 : 3;
    return list.slice(0, limit);
  };

  const displayItems = getDisplayItems();
  const totalItems = isMyEventsRow ? addedEvents.length : events.length;

  return (
    <section className="event-row">
      <div className="row-header">
        <h2>{title}</h2>
        {/* Shows button only if there are more than 3 items */}
        {totalItems > 3 && (
          <button className="more-link" onClick={() => setShowAll(!showAll)}>
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
          <div className="row-grid">
            {displayItems.map((event, index) => {
              const eventId = typeof event === 'string' ? event : (event.event?._id || event._id);
              const bannerImage = typeof event === 'object' ? (event.event?.bannerImage || event.bannerImage) : null;
              
              return (
                <EventBanner key={index} id={eventId} image={bannerImage} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

// --- SIDEBAR SECTION ---
export const SidebarSection = ({ title, events = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  const displayItems = showAll ? events.slice(0, 6) : events.slice(0, 3);

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-title">{title}</h3>
      <div className="sidebar-items">
        {displayItems.map((event, index) => (
          <div
            key={index}
            className="sidebar-event-card"
            onClick={() => navigate(`/event/${event._id}`)}
          >
            <div
              className="sidebar-card-banner"
              style={{ 
                backgroundImage: `url(${event.bannerImage || "/images-e/default.jpg"})`,
                backgroundSize: 'cover'
              }}
            />
          </div>
        ))}
      </div>
      {events.length > 3 && (
        <button className="sidebar-view-more" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "More >"}
        </button>
      )}
    </div>
  );
};