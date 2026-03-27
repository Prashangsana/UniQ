import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
    // Load ALL societies
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
          // Only show published events in main event (no drafts)
          if (data.data && data.data.status !== 'Draft') {
            setMainEvent(data.data);
          }
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
          // Filter out draft events from latest events
          const filteredEvents = data.data.filter(event => event.status !== 'Draft');
          setLatestEvents(filteredEvents);
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

            <h3>Explore societies</h3>

            <div className="societies-list">

              {displayedSocieties.map((club) => (

                <SocietyCard
                  key={club._id || club.id || club.shortName || club.name}
                  id={club._id || club.id || club.societyId}
                  shortName={club.shortName}
                  name={club.name}
                  logo={club.logo}
                />

              ))}

            </div>

            {societies.length > 5 && (
              <button
                className="sidebar-view-more"
                onClick={() => setShowAllSocieties(!showAllSocieties)}
              >
                {showAllSocieties ? "Show less" : "More >"}
              </button>
            )}

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
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [eventData, setEventData] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  const isAdded = (myEventsList || []).some(
    e => {
      const savedEventId = e.event?._id || e.event || e;
      return savedEventId.toString() === eventId?.toString();
    }
  );

  useEffect(() => {
    if (!eventId || eventId === 'new') {
      setFetchDone(true);
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
      .finally(() => setFetchDone(true));
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

  if (fetchDone && !eventData && eventId && eventId !== 'new') {
    return <div className="error">Event not found</div>;
  }

  const displayTitle = eventData?.title || "";
  const heroImagePath = eventData?.bannerImage || "/images-e/default.jpg";

  return (
    <div className="event-details-page">

      <div className="navigation-header">
        <button
          className="back-btn"
          onClick={() => {
            // Check if we came from Society & Events page (tab: 'societies')
            const tab = location.state?.tab;
            if (tab === 'societies') {
              navigate('/', { state: { tab: 'societies' } });
            } else {
              navigate(-1);
            }
          }}
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
              {" "}{eventData?.description ?? ""}
            </p>

            <div className="event-links">

              {eventData?.instagramLink && (
                <a
                  href={eventData?.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn insta"
                >
                  Instagram
                </a>
              )}

              {eventData?.registerLink && (
                <a
                  href={eventData?.registerLink}
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
              <p>
                {eventData?.date
                  ? new Date(eventData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </p>
            </div>

            <div className="meta-item">
              <span>⏰ Time:</span>
              <p>{eventData?.time ?? '—'}</p>
            </div>

            <div className="meta-item">
              <span>📍 Place:</span>
              <p>{eventData?.venue || eventData?.place || '—'}</p>
            </div>

            {eventData?.tickets && eventData.tickets.length > 0 ? (
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
                <p>{eventData?.price || "Free"}</p>
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
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [profileData, setProfileData] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);
  const [error, setError] = useState(null);

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
    const loadProfileData = async () => {
      try {
        setError(null);
        let resolvedId = id;

        // If the param isn't a Mongo ObjectId, try to resolve by slug/shortName/name
        if (!/^[a-f0-9]{24}$/i.test(resolvedId || '')) {
          const listRes = await fetch(`${API_URL}/api/societies`, { credentials: "include" });
          const listData = await listRes.json();
          if (listData.success) {
            const lower = (resolvedId || '').toLowerCase();
            const match = (listData.data || []).find(s => {
              const byShort = s.shortName && s.shortName.toLowerCase() === lower;
              const bySlug = s.name && s.name.toLowerCase().replace(/\s+/g, '-') === lower;
              return byShort || bySlug;
            });
            if (match?._id) resolvedId = match._id;
          }
        }

        /* LOAD SOCIETY PROFILE */
        const profileRes = await fetch(`${API_URL}/api/societies/${resolvedId}`, {
          credentials: "include"
        });
        
        const profileData = await profileRes.json();
        
        if (!profileData.success) {
          setError(profileData.message || "Failed to load society profile");
          return;
        }
        
        setProfileData(profileData.data);

        /* LOAD FOLLOW STATUS */
        const followRes = await fetch(`${API_URL}/api/societies/${resolvedId}/follow-status`, {
          credentials: "include"
        });
        
        const followData = await followRes.json();
        
        if (followData.success) {
          setFollowing(followData.following);
        }
        
      } catch (err) {
        console.error("Error loading society profile:", err);
        setError("Failed to load society profile");
      } finally {
        setFetchDone(true);
      }
    };

    if (id) {
      loadProfileData();
    } else {
      setError("No society ID provided");
      setFetchDone(true);
    }
  }, [id, API_URL]);

  if (fetchDone && !profileData && !error) return (
  <div className="society-profile-page">
    <div className="navigation-header">
      <button
        className="back-btn"
        type="button"
        onClick={() => {
          const tab = location.state?.tab;
          if (tab) {
            navigate('/', { state: { tab } });
          } else {
            navigate(-1);
          }
        }}
      >
        ← Back
      </button>
    </div>
    <div className="error" style={{ textAlign: 'center', padding: '40px' }}>
      <h3>Society not found</h3>
      <p>The society with ID "{id}" was not found.</p>
      <p>Please check if societies exist in the database.</p>
    </div>
  </div>
);
  
  if (error) {
    return (
      <div className="society-profile-page">
        <div className="navigation-header">
          <button
            className="back-btn"
            type="button"
            onClick={() => {
              const tab = location.state?.tab;
              if (tab) {
                navigate('/', { state: { tab } });
              } else {
                navigate(-1);
              }
            }}
          >
            ← Back
          </button>
        </div>
        <div className="error" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Error: {error}</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="society-profile-page">
        <div className="navigation-header">
          <button
            className="back-btn"
            type="button"
            onClick={() => {
              const tab = location.state?.tab;
              if (tab) {
                navigate('/', { state: { tab } });
              } else {
                navigate(-1);
              }
            }}
          >
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading society profile...</h3>
        </div>
      </div>
    );
  }

  const { society, events } = profileData;

  return (
    <div className="society-profile-page">

      <div className="navigation-header">
        <button
          className="back-btn"
          type="button"
          onClick={() => {
            const tab = location.state?.tab;
            if (tab) {
              navigate('/', { state: { tab } });
            } else {
              navigate(-1);
            }
          }}
        >
          ← Back
        </button>
      </div>

      <header className="society-header">

        <img
          src={society.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(society.name || 'S')}&background=e2e8f0&color=64748b&bold=true`}
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
        </div>

        <div className="events-grid-profile">

          {events.filter(event => event.status !== 'Draft').map((event) => (
            <EventBanner
              key={event._id}
              id={event._id}
              title={event.title}
              image={event.bannerImage}
            />
          ))}

        </div>

      </section>

    </div>
  );
};
