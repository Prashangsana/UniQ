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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /* LOAD SOCIETIES */
  useEffect(() => {

    fetch(`${API_URL}/api/societies`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSocieties(data.data);
        }
      })
      .catch(err => console.error("Error loading societies:", err));

  }, [API_URL]);

  /* LOAD NOTIFICATIONS */
  useEffect(() => {

    fetch(`${API_URL}/api/events/notifications`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {

        if (data.success) {
          setNotifications(data.data.map(n => n.message));
        }

      })
      .catch(err => console.log(err));

  }, [API_URL]);

  /* LOAD STAGE 4 EVENT DISCOVERY DATA */
  useEffect(() => {

    /* MAIN EVENT */
    fetch(`${API_URL}/api/events/main`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMainEvent(data.data);
        }
      })
      .catch(err => console.log("Main event error:", err));

    /* MORE EVENTS FOR YOU */
    fetch(`${API_URL}/api/events/latest`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLatestEvents(data.data);
        }
      })
      .catch(err => console.log("Latest events error:", err));

    /* TOP EVENTS THIS WEEK */
    fetch(`${API_URL}/api/events/top-week`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTopEvents(data.data);
        }
      })
      .catch(err => console.log("Top events error:", err));

  }, [API_URL]);

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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdded = (myEventsList || []).some(
    e => {
      const savedEventId = e.event?._id || e.event || e;
      return savedEventId.toString() === eventId?.toString();
    }
  );

  useEffect(() => {
    if (!eventId || eventId === 'new') {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEventData(data.data);
        }
      })
      .catch(err => console.error("Error loading event details:", err))
      .finally(() => setLoading(false));
  }, [eventId, API_URL]);

  const handleAddEvent = async () => {

    if (!eventId) return;

    try {

      const res = await fetch(
        `${API_URL}/api/events/${eventId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );

      const data = await res.json();

      if (data.success) {
        onAddEvent(eventId);
      } else {
        alert(data.message || "Failed to add event");
      }

    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Make sure you are logged in.");
    }

  };

  const handleRemoveEvent = async () => {

    if (!eventId) return;

    try {

      const res = await fetch(
        `${API_URL}/api/events/${eventId}/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );

      const data = await res.json();

      if (data.success) {
        onRemoveEvent(eventId);
      } else {
        alert(data.message || "Failed to remove event");
      }

    } catch (error) {
      console.error("Error removing event:", error);
      alert("Error removing event.");
    }

  };

  if (loading) return <div className="loading">Loading Event Details...</div>;
  if (!eventData) return <div className="error">Event not found</div>;

  const displayTitle = eventData.title || "";
  const heroImagePath = eventData.bannerImage || "/images-e/default.jpg";

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
              {" "}{eventData.description}
            </p>

            <div className="event-links">

              {eventData.instagramLink && (
                <a
                  href={eventData.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn insta"
                >
                  Instagram
                </a>
              )}

              {eventData.registerLink && (
                <a
                  href={eventData.registerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn register"
                >
                  Participate
                </a>
              )}

            </div>

          </div>

          <div className="event-meta-sidebar">

            <div className="meta-item">
              <span>📅 Date:</span>
              <p>{new Date(eventData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="meta-item">
              <span>⏰ Time:</span>
              <p>{eventData.time}</p>
            </div>

            <div className="meta-item">
              <span>📍 Place:</span>
              <p>{eventData.venue || eventData.place}</p>
            </div>

            {eventData.tickets && eventData.tickets.length > 0 ? (
              <div className="meta-item">
                <span>💰 Tickets:</span>
                {eventData.tickets.map((t, i) => (
                  <p key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
                    {t.name}: {t.price}
                  </p>
                ))}
              </div>
            ) : (
              <div className="meta-item">
                <span>💰 Price:</span>
                <p>{eventData.price || "Free"}</p>
              </div>
            )}

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
export const SocietyProfilePage = ({ userRole }) => {

  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🧩 STEP 6 — FOLLOW STATE */
  const [following, setFollowing] = useState(false);

  const handleFollow = async () => {

    if (following) {

      await fetch(`${API_URL}/api/societies/${id}/follow`, {
        method: "DELETE",
        credentials: "include"
      });

      setFollowing(false);

    } else {

      await fetch(`${API_URL}/api/societies/${id}/follow`, {
        method: "POST",
        credentials: "include"
      });

      setFollowing(true);

    }

  };

  useEffect(() => {

  /* LOAD SOCIETY PROFILE */
  fetch(`${API_URL}/api/societies/${id}`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setProfileData(data.data);
      }

    })
    .catch(err => console.error("Error loading profile:", err))
    .finally(() => setLoading(false));


  /* LOAD FOLLOW STATUS */
  fetch(`${API_URL}/api/societies/${id}/follow-status`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setFollowing(data.following);
      }

    })
    .catch(err => console.error("Follow status error:", err));

}, [id, API_URL]);


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

        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Our Events</h2>
          {userRole === 'society_leader' && (
            <button 
              className="publish-btn" 
              onClick={() => navigate(`/admin/event/new?societyId=${id}`)}
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              + Add Event
            </button>
          )}
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