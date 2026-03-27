import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./EventsComponents.css";

// --- EVENT BANNER ---
export const EventBanner = ({ large, id = "sample-event", title, image }) => {
  const navigate = useNavigate();
  const displayTitle = title || id.replace(/-/g, ' ').toUpperCase();
  
  return (
    <div
      className={`event-banner ${large ? "large" : ""}`}
      onClick={() => navigate(`/event/${id}`)}
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${image || "/logo.png"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="event-banner-text" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '15px',
        textAlign: 'left',
        background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.9))',
      }}>
        {displayTitle}
      </div>
    </div>
  );
};

// --- SOCIETY CARD ---
export const SocietyCard = ({ name, id, shortName, logo }) => {
  const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : '';
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'S')}&background=e2e8f0&color=64748b&bold=true`;
  const pathParam = id || shortName || slug;

  if (!pathParam) {
    return (
      <div className="society-card-link">
        <div className="society-card">
          <img
            src={logo || `/images-e/societies/${slug}.png`}
            alt={name}
            className="society-logo"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = avatarFallback;
            }}
          />
          <span>{name}</span>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/society/${pathParam}`} state={{ tab: 'society' }} className="society-card-link">
      <div className="society-card">
        <img
          src={logo || `/images-e/societies/${slug}.png`}
          alt={name}
          className="society-logo"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = avatarFallback;
          }}
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
    <div className="events-sidebar-section">
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
                backgroundImage: `url(${event.bannerImage || "/logo.png"})`,
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
