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
export const EventRow = ({ title, addedEvents = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const isMyEventsRow = title === "My events";

  const getDisplayItems = () => {
    if (isMyEventsRow) {
      return showAll ? addedEvents : addedEvents.slice(0, 3);
    }
    // FIX: Provide 6 IDs to support a second row of three
    return ["career-fair-2026", "sports-meet", "tech-symposium", "workshop-01", "concert-night", "hack-it"].slice(0, showAll ? 6 : 3);
  };

  const displayItems = getDisplayItems();

  return (
    <section className="event-row">
      <div className="row-header">
        <h2>{title}</h2>
        {/* Shows button only if there are more than 3 items */}
        {(isMyEventsRow ? addedEvents.length > 3 : true) && (
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
          <div className="row-grid"> {/* Grid container for rows of 3 */}
            {displayItems.map((itemId, index) => {
              let img = `/images-e/events/${itemId}.jpg`;
              if (itemId === "main-hackathon-2026") img = "/images-e/events/main-event.jpg";
              
              // Handle unique society IDs added to 'My Events'
              if (itemId.includes("-event-")) {
                const [club, num] = itemId.split("-event-");
                img = `/images-e/club-events/${club}/event${num}.jpg`;
              }

              return (
                <EventBanner key={index} id={itemId} image={img} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

// --- SIDEBAR SECTION ---
export const SidebarSection = ({ title }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  const trendingIds = ["top-event-1", "top-event-2", "top-event-3", "top-event-4", "top-event-5"];
  const displayItems = showAll ? trendingIds : trendingIds.slice(0, 3);

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-title">{title}</h3>
      <div className="sidebar-items">
        {displayItems.map((itemId, index) => (
          <div
            key={index}
            className="sidebar-event-card"
            onClick={() => navigate(`/event/${itemId}`)}
          >
            <div
              className="sidebar-card-banner"
              style={{ 
                backgroundImage: `url(/images-e/events/${itemId}.jpg)`,
                backgroundSize: 'cover'
              }}
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