import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventBanner, EventRow, SidebarSection, SocietyCard } from "../components/EventsComponents";
import "./Event.css";

/* ================= EVENTS PAGE (Dashboard View) ================= */
export const EventsPage = ({ myEventsList = [] }) => {

  const [societies, setSocieties] = useState([]);
  const [showAllSocieties, setShowAllSocieties] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* STAGE 4 DATA */
  const [mainEvent, setMainEvent] = useState(null);
  const [latestEvents, setLatestEvents] = useState([]);
  const [topEvents, setTopEvents] = useState([]);

  /* LOAD SOCIETIES */
  useEffect(() => {

    fetch("http://localhost:5000/api/societies")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSocieties(data.data);
        }
      })
      .catch(err => console.error("Error loading societies:", err));

  }, []);

  /* LOAD NOTIFICATIONS */
  useEffect(() => {

    fetch("http://localhost:5000/api/events/notifications")
      .then(res => res.json())
      .then(data => {

        if (data.success) {
          setNotifications(data.data.map(n => n.message));
        }

      })
      .catch(err => console.log(err));

  }, []);

  /* LOAD STAGE 4 EVENT DISCOVERY DATA */
  useEffect(() => {

    /* MAIN EVENT */
    fetch("http://localhost:5000/api/events/main")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMainEvent(data.data);
        }
      })
      .catch(err => console.log("Main event error:", err));

    /* MORE EVENTS FOR YOU */
    fetch("http://localhost:5000/api/events/latest")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLatestEvents(data.data);
        }
      })
      .catch(err => console.log("Latest events error:", err));

    /* TOP EVENTS THIS WEEK */
    fetch("http://localhost:5000/api/events/top-week")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTopEvents(data.data);
        }
      })
      .catch(err => console.log("Top events error:", err));

  }, []);

  const displayedSocieties = showAllSocieties ? societies : societies.slice(0, 5);

  return (
    <div className="events-page">

      {notifications.length > 0 && (
        <div className="notification-box">
          <h4>🔔 Notifications</h4>
          {notifications.map((note, index) => (
            <p key={index}>{note}</p>
          ))}
        </div>
      )}

      <div className="events-layout">

        <div className="events-left">

          <section className="main-events-section">
            <h2>Main events</h2>

            {mainEvent && (
              <EventBanner
                large
                id={mainEvent._id}
                image={mainEvent.bannerImage}
              />
            )}

          </section>

          <EventRow
            title="My events"
            addedEvents={myEventsList}
          />

          <EventRow
            title="More events for you"
            events={latestEvents}
          />

        </div>

        <div className="events-right">

          <SidebarSection
            title="Top this week"
            events={topEvents}
          />

          <div className="societies-section">

            <h3>Your societies</h3>

            <div className="societies-list">

              {displayedSocieties.map((club) => (

                <SocietyCard
                  key={club._id}
                  id={club._id}
                  name={club.name}
                  logo={club.logo}
                />

              ))}

            </div>

            <button
              className="sidebar-view-more"
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


/* ================= EVENT DETAILS PAGE ================= */
export const EventDetailsPage = ({ onAddEvent, onRemoveEvent, myEventsList = [] }) => {

  const params = useParams();
  const eventId = params.eventId || params.id;
  const navigate = useNavigate();

  const isAdded = (myEventsList || []).some(
    e => (typeof e === "string" ? e === eventId : e.event === eventId)
  );

  const displayTitle = eventId ? eventId.replace(/-/g, " ") : "";

  const getHeroImage = (id) => {

    if (!id) return "/images-e/default.jpg";

    if (id === "main-hackathon-2026") {
      return "/images-e/events/main-event.jpg";
    }

    if (id.includes("-event-")) {
      const [clubName, eventPart] = id.split("-event-");
      return `/images-e/club-events/${clubName}/event${eventPart}.jpg`;
    }

    return `/images-e/events/${id}.jpg`;

  };

  const heroImagePath = getHeroImage(eventId);

  const handleAddEvent = async () => {

    if (!eventId) return;

    try {

      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        onAddEvent(eventId);
      }

    } catch (error) {
      console.error("Error adding event:", error);
    }

  };

  const handleRemoveEvent = async () => {

    if (!eventId) return;

    try {

      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        onRemoveEvent(eventId);
      }

    } catch (error) {
      console.error("Error removing event:", error);
    }

  };

  return (
    <div className="event-details-page">

      <div className="navigation-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <div className="event-details-container">

        <div
          className="event-hero-image"
          style={{
            backgroundImage: `url(${heroImagePath}), url(/images-e/default.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <h2>{displayTitle.toUpperCase()}</h2>
        </div>

        <div className="event-info-grid">

          <div className="event-main-info">

            <h1>{displayTitle}</h1>

            <p className="event-description-text">
              <strong>Description:</strong>
              {" "}This is a unique event detail page for {displayTitle}.
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
                Participate
              </a>

            </div>

          </div>

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

      <div className="external-action-area">

        {!isAdded ? (

          <button
            className="add-to-events-btn"
            onClick={handleAddEvent}
          >
            + Add to My Events
          </button>

        ) : (

          <button
            className="remove-from-events-btn"
            onClick={handleRemoveEvent}
          >
            ✕ Remove from My Events
          </button>

        )}

      </div>

    </div>
  );
};

/* ================= SOCIETY PROFILE PAGE ================= */
export const SocietyProfilePage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🧩 STEP 6 — FOLLOW STATE */
  const [following, setFollowing] = useState(false);

  const handleFollow = async () => {

    if (following) {

      await fetch(`http://localhost:5000/api/societies/${id}/follow`, {
        method: "DELETE"
      });

      setFollowing(false);

    } else {

      await fetch(`http://localhost:5000/api/societies/${id}/follow`, {
        method: "POST"
      });

      setFollowing(true);

    }

  };

  useEffect(() => {

  /* LOAD SOCIETY PROFILE */
  fetch(`http://localhost:5000/api/societies/${id}`)
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setProfileData(data.data);
      }

    })
    .catch(err => console.error("Error loading profile:", err))
    .finally(() => setLoading(false));


  /* LOAD FOLLOW STATUS */
  fetch(`http://localhost:5000/api/societies/${id}/follow-status`)
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setFollowing(data.following);
      }

    })
    .catch(err => console.error("Follow status error:", err));

}, [id]);


  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!profileData) return <div className="error">Society not found</div>;

  const { society, events } = profileData;

  return (
    <div className="society-profile-page">

      <div className="navigation-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>


      <header className="society-header">

        <img
          src={society.logo}
          alt={society.name}
          className="society-logo-large"
        />

        <h1 className="society-full-name">
          {society.name} OF IIT
        </h1>

        {/* FOLLOW BUTTON */}
        <button className="join-btn" onClick={handleFollow}>
          {following ? "Following" : "Follow"}
        </button>

      </header>

      <hr className="divider" />


      <section className="society-events-section">

        <div className="section-header">
          <h2>Our Events</h2>
        </div>

        <div className="events-grid-profile">

          {events.map((event) => (

            <EventBanner
              key={event._id}
              id={event._id}
              image={event.bannerImage}
            />

          ))}

        </div>

      </section>

    </div>
  );
};