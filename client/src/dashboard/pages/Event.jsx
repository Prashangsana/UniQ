import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import EventBanner from "../../components/EventBanner";
import EventRow from "../../components/EventRow";
import SidebarSection from "../../components/SidebarSection";
import SocietyCard from "../../components/SocietyCard";

import "./Event.css";

/* ================= EVENTS PAGE ================= */

export const EventsPage = ({ myEventsList = [] }) => {
  const [showAllSocieties, setShowAllSocieties] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* ---------- Load Notifications ---------- */

  useEffect(() => {
    const followed =
      JSON.parse(localStorage.getItem("followedSocieties")) || [];

    const savedEvents =
      JSON.parse(localStorage.getItem("societyEvents")) || {};

    let newNotes = [];

    followed.forEach((society) => {
      if (savedEvents[society]) {
        savedEvents[society].forEach((event) => {
          newNotes.push(
            `${society.replace("-", " ")} added: ${event}`
          );
        });
      }
    });

    setNotifications(newNotes);
  }, []);

  /* ---------- Societies ---------- */

  const societies = [
    "ROTARACT CLUB",
    "IEEE CLUB",
    "BIZLINK SOCIETY",
    "IIT SPORTS CLUB",
    "MOZILLA CLUB",
    "IEEE CS CLUB",
    "LEO CLUB",
    "TOASTMASTERS CLUB",
    "YOUTH PULSE CLUB",
  ];

  const displayedSocieties = showAllSocieties
    ? societies
    : societies.slice(0, 5);

  return (
    <div className="events-page">

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notification-box">
          <h4>🔔 Notifications</h4>

          {notifications.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
        </div>
      )}

      <div className="events-layout">

        {/* LEFT SIDE */}
        <div className="events-left">

          <section className="main-events-section">
            <h2>Main events</h2>

            <EventBanner
              large
              id="main-hackathon-2026"
              image="/images/main-event.jpg"
            />
          </section>

          <EventRow title="My events" addedEvents={myEventsList} />

          <EventRow title="More events for you" />

        </div>

        {/* RIGHT SIDE */}
        <div className="events-right">

          <SidebarSection title="Top this week" />

          <div className="societies-section">

            <h3>Your societies</h3>

            <div className="societies-list">
              {displayedSocieties.map((club) => (
                <SocietyCard key={club} name={club} />
              ))}
            </div>

            <button
              className="societies-more-btn-pill"
              onClick={() => setShowAllSocieties(!showAllSocieties)}
            >
              {showAllSocieties ? "Show less" : "More >"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

/* ================= EVENT DETAILS ================= */

export const EventDetailsPage = ({
  onAddEvent,
  onRemoveEvent,
  myEventsList = [],
}) => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const isAdded = myEventsList.includes(eventId);

  const displayTitle = eventId?.replace(/-/g, " ");

  return (
    <div className="event-details-page">

      {/* Back */}
      <div className="navigation-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="event-details-container">

        {/* Banner */}
        <div
          className="event-hero-image"
          style={{
            backgroundImage: "url(/images/main-event.jpg)",
            backgroundSize: "cover",
          }}
        >
          <h2>{displayTitle?.toUpperCase()}</h2>
        </div>

        <div className="event-info-grid">

          {/* Info */}
          <div className="event-main-info">

            <h1>{displayTitle}</h1>

            <p className="event-description-text">
              <strong>Description:</strong> Standard event details and
              descriptions.
            </p>

            <div className="event-links">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="link-btn insta"
              >
                Instagram
              </a>

              <a
                href="https://forms.google.com"
                target="_blank"
                rel="noreferrer"
                className="link-btn register"
              >
                Register
              </a>

              <a
                href="https://tickets.com"
                target="_blank"
                rel="noreferrer"
                className="link-btn tickets"
              >
                Tickets
              </a>

            </div>

          </div>

          {/* Sidebar */}
          <div className="event-meta-sidebar">

            <div className="meta-item">
              <span>📅 Date:</span>
              <p>Oct 25, 2026</p>
            </div>

            <div className="meta-item">
              <span>⏰ Time:</span>
              <p>09:00 AM</p>
            </div>

            <div className="meta-item">
              <span>📍 Place:</span>
              <p>IIT Auditorium</p>
            </div>

            <div className="meta-item">
              <span>💰 Price:</span>
              <p>LKR 1000</p>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Button */}
      <div className="external-action-area">

        {!isAdded ? (
          <button
            className="add-to-events-btn"
            onClick={() => onAddEvent(eventId)}
          >
            + Add to My Events
          </button>
        ) : (
          <button
            className="remove-from-events-btn"
            onClick={() => onRemoveEvent(eventId)}
          >
            ✕ Remove from My Events
          </button>
        )}

      </div>

    </div>
  );
};

/* ================= SOCIETY PROFILE ================= */

export const SocietyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------- Follow State ---------- */

  const [isFollowing, setIsFollowing] = useState(() => {
    const saved = localStorage.getItem("followedSocieties");
    const list = saved ? JSON.parse(saved) : [];
    return list.includes(id);
  });

  const [showAllEvents, setShowAllEvents] = useState(false);

  /* ---------- Toggle Follow ---------- */

  const handleFollowToggle = () => {
    const saved = localStorage.getItem("followedSocieties");
    let list = saved ? JSON.parse(saved) : [];

    if (isFollowing) {
      list = list.filter((item) => item !== id);
    } else {
      list.push(id);
    }

    localStorage.setItem("followedSocieties", JSON.stringify(list));

    setIsFollowing(!isFollowing);
  };

  /* ---------- Events ---------- */

  const allEvents = [
    "soc-event-1",
    "soc-event-2",
    "soc-event-3",
    "soc-event-4",
    "soc-event-5",
    "soc-event-6",
  ];

  const displayedEvents = showAllEvents
    ? allEvents
    : allEvents.slice(0, 3);

  return (
    <div className="society-profile-page">

      {/* Back */}
      <div className="navigation-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      {/* Header */}
      <header className="society-header">

        <img
          src={`/images/${id}.png`}
          alt="Society"
          className="society-logo-large"
          onError={(e) => {
            e.target.src = "/images/default.jpg";
          }}
        />

        <h1 className="society-full-name">
          {id.replace(/-/g, " ").toUpperCase()} OF IIT
        </h1>

        <button
          className={`join-btn ${isFollowing ? "joined" : ""}`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

      </header>

      <hr className="divider" />

      {/* Events */}
      <section className="society-events-section">

        <div className="section-header">

          <h2>Our Events</h2>

          <button
            className="more-link"
            onClick={() => setShowAllEvents(!showAllEvents)}
          >
            {showAllEvents ? "Show less" : "More >"}
          </button>

        </div>

        <div className="events-grid-profile">

          {displayedEvents.map((eventId, index) => (
            <EventBanner
              key={index}
              id={eventId}
              image={`/images/${id}/event${index + 1}.jpg`}
            />
          ))}

        </div>

      </section>

    </div>
  );
};