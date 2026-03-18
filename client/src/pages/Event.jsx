import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Import everything from your consolidated components file
import { EventBanner, EventRow, SidebarSection, SocietyCard } from "../components/EventsComponents";

import "./Event.css";

/* ================= EVENTS PAGE (Dashboard View) ================= */
export const EventsPage = ({ myEventsList = [] }) => {
  const [showAllSocieties, setShowAllSocieties] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const followed = JSON.parse(localStorage.getItem("followedSocieties")) || [];
    const savedEvents = JSON.parse(localStorage.getItem("societyEvents")) || {};
    let newNotes = [];

    followed.forEach((society) => {
      if (savedEvents[society]) {
        savedEvents[society].forEach((event) => {
          newNotes.push(`${society.replace("-", " ")} added: ${event}`);
        });
      }
    });
    setNotifications(newNotes);
  }, []);

  const societies = [
    "ROTARACT CLUB", "IEEE CLUB", "BIZLINK SOCIETY", "IIT SPORTS CLUB",
    "MOZILLA CLUB", "IEEE CS CLUB", "LEO CLUB", "TOASTMASTERS CLUB", "YOUTH PULSE CLUB",
  ];

  const displayedSocieties = showAllSocieties ? societies : societies.slice(0, 5);

  return (
    <div className="events-page">
      {notifications.length > 0 && (
        <div className="notification-box">
          <h4>🔔 Notifications</h4>
          {notifications.map((note, index) => <p key={index}>{note}</p>)}
        </div>
      )}

      <div className="events-layout">
        <div className="events-left">
          <section className="main-events-section">
            <h2>Main events</h2>
            <EventBanner large id="main-hackathon-2026" image="/images-e/events/main-event.jpg" />
          </section>
          <EventRow title="My events" addedEvents={myEventsList} />
          <EventRow title="More events for you" />
        </div>

        <div className="events-right">
          <SidebarSection title="Top this week" />
          <div className="societies-section">
            <h3>Your societies</h3>
            <div className="societies-list">
              {displayedSocieties.map((club) => (
                <SocietyCard key={club} name={club} />
              ))}
            </div>
            {/* The blue pill button matches SidebarSection design */}
            <button className="sidebar-view-more" onClick={() => setShowAllSocieties(!showAllSocieties)}>
              {showAllSocieties ? "Show less" : "More >"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= EVENT DETAILS PAGE ================= */
export const EventDetailsPage = ({ onAddEvent, onRemoveEvent, myEventsList = [] }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const isAdded = myEventsList.includes(eventId);
  const displayTitle = eventId?.replace(/-/g, " ");

  return (
    <div className="event-details-page">
      <div className="navigation-header">
        {/* Back button goes back one step in history (useful if coming from Club profile) */}
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="event-details-container">
        <div className="event-hero-image" style={{ backgroundImage: "url(/images-e/events/main-event.jpg)", backgroundSize: "cover" }}>
          <h2>{displayTitle?.toUpperCase()}</h2>
        </div>
        <div className="event-info-grid">
          <div className="event-main-info">
            <h1>{displayTitle}</h1>
            <p className="event-description-text"><strong>Description:</strong> Standard event details and descriptions.</p>
            <div className="event-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="link-btn insta">Instagram</a>
              <a href="https://forms.google.com" target="_blank" rel="noreferrer" className="link-btn register">Register</a>
              <a href="https://tickets.com" target="_blank" rel="noreferrer" className="link-btn tickets">Tickets</a>
            </div>
          </div>
          <div className="event-meta-sidebar">
            <div className="meta-item"><span>📅 Date:</span><p>Oct 25, 2026</p></div>
            <div className="meta-item"><span>⏰ Time:</span><p>09:00 AM</p></div>
            <div className="meta-item"><span>📍 Place:</span><p>IIT Auditorium</p></div>
            <div className="meta-item"><span>💰 Price:</span><p>LKR 1000</p></div>
          </div>
        </div>
      </div>

      <div className="external-action-area">
        {!isAdded ? (
          <button className="add-to-events-btn" onClick={() => onAddEvent(eventId)}>+ Add to My Events</button>
        ) : (
          <button className="remove-from-events-btn" onClick={() => onRemoveEvent(eventId)}>✕ Remove from My Events</button>
        )}
      </div>
    </div>
  );
};

/* ================= SOCIETY PROFILE PAGE ================= */
export const SocietyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(() => {
    const saved = localStorage.getItem("followedSocieties");
    const list = saved ? JSON.parse(saved) : [];
    return list.includes(id);
  });
  const [showAllEvents, setShowAllEvents] = useState(false);

  const handleFollowToggle = () => {
    const saved = localStorage.getItem("followedSocieties");
    let list = saved ? JSON.parse(saved) : [];
    isFollowing ? (list = list.filter((item) => item !== id)) : list.push(id);
    localStorage.setItem("followedSocieties", JSON.stringify(list));
    setIsFollowing(!isFollowing);
  };

  const allEvents = ["soc-event-1", "soc-event-2", "soc-event-3", "soc-event-4", "soc-event-5", "soc-event-6"];
  const displayedEvents = showAllEvents ? allEvents : allEvents.slice(0, 3);

  return (
    <div className="society-profile-page">
      <div className="navigation-header">
        {/* Forces back to the dashboard's society tab */}
        <button className="back-btn" onClick={() => navigate("/", { state: { tab: 'society' } })}>
          ← Back
        </button>
      </div>

      <header className="society-header">
        <img src={`/images-e/societies/${id}.png`} alt="Society" className="society-logo-large" onError={(e) => { e.target.src = "/images/default.jpg"; }} />
        <h1 className="society-full-name">{id.replace(/-/g, " ").toUpperCase()} OF IIT</h1>
        <button className={`join-btn ${isFollowing ? "joined" : ""}`} onClick={handleFollowToggle}>
          {isFollowing ? "Following" : "Follow"}
        </button>
      </header>
      
      <hr className="divider" />
      
      <section className="society-events-section">
        <div className="section-header">
          <h2>Our Events</h2>
          <button className="more-link" onClick={() => setShowAllEvents(!showAllEvents)}>{showAllEvents ? "Show less" : "More >"}</button>
        </div>
        <div className="events-grid-profile">
          {displayedEvents.map((eventId, index) => (
            <EventBanner key={index} id={eventId} image={`/images-e/club-events/${id}/event${index + 1}.jpg`} />
          ))}
        </div>
      </section>
    </div>
  );
};