import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Leader.css';
import { LeaderEventBanner, LeaderEventRow, LeaderSidebar, LeaderSocietyCard } from '../components/LeaderEvent';


/* ==========================================
   1. LEADER DASHBOARD
========================================== */
export const LeaderDashboard = () => {
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [societies, setSocieties] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [userName, setUserName] = useState('Leader');

  useEffect(() => {
    // Load User Info
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUserName(data.user.name);
        }
      })
      .catch(err => console.error("Error loading user info:", err));

    // Load all Societies
    fetch(`${API_URL}/api/societies`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) setSocieties(data.data);
      })
      .catch(err => console.error("Error loading societies:", err));

    // Load Leader's Events
    fetch(`${API_URL}/api/events`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          const allEvents = data.data;
          setActiveEvents(allEvents.filter(e => e.status === 'Active' || e.status === 'Featured').map(e => e._id));
          setDraftEvents(allEvents.filter(e => e.status === 'Draft').map(e => e._id));
        }
      })
      .catch(err => console.error("Error loading events:", err));
  }, [API_URL]);

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <div className="admin-left">
          <header className="admin-header">
            <div>
              <h1>Society Leader Portal</h1>
              <p>Welcome back, {userName}</p>
            </div>
            <button className="publish-btn" onClick={() => navigate('/admin/event/new')}>
              + Create New Event
            </button>
          </header>
          
          <LeaderEventRow title="Drafted/Past Events" events={draftEvents} />
        </div>

        <div className="admin-right">
          <div className="manage-societies">
            <h3>Your societies</h3>
            <div className="societies-list-container">
              {societies.map(s => (
                <LeaderSocietyCard key={s._id} id={s._id} name={s.name} logo={s.logo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ==========================================
   2. LEADER EVENT EDITOR (Handles both Edit & Create)
========================================== */
export const LeaderEventEditor = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewEvent = eventId === 'new';

  // Get societyId from query params if available
  const queryParams = new URLSearchParams(location.search);
  const preselectedSocietyId = queryParams.get('societyId');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState({ dd: '', mm: '', yyyy: '' });
  const [time, setTime] = useState({ hh: '09', min: '00', period: 'AM' });
  const [venue, setVenue] = useState('');
  const [adminLink, setAdminLink] = useState('');
  const [registerLink, setRegisterLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [tickets, setTickets] = useState([{ name: 'Standard Ticket', price: '' }]);
  const [status, setStatus] = useState('Draft');
  const [bannerImage, setBannerImage] = useState('');
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState('');

  // Load existing data if editing
  useEffect(() => {
    // Load Leader's Societies
    fetch(`${API_URL}/api/societies/leader/all`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSocieties(data.data);
          if (data.data.length > 0 && !selectedSociety) {
            // Priority: Query Param > First Society in list
            setSelectedSociety(preselectedSocietyId || data.data[0]._id);
          }
        }
      })
      .catch(err => console.error("Error loading societies:", err));

    if (!isNewEvent) {
      fetch(`${API_URL}/api/events/${eventId}`, { 
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const ev = data.data;
            setTitle(ev.title || '');
            setDescription(ev.description || '');
            setVenue(ev.venue || ev.location || '');
            setAdminLink(ev.adminLink || '');
            setRegisterLink(ev.registerLink || '');
            setInstagramLink(ev.instagramLink || '');
            setTickets(ev.tickets || ev.ticketTiers || [{ name: 'Standard Ticket', price: '' }]);
            setStatus(ev.status || 'Draft');
            setBannerImage(ev.bannerImage || '');
            setSelectedSociety(ev.society?._id || ev.society || '');
            
            if (ev.time) {
              const [t, p] = ev.time.split(' ');
              const [h, m] = t.split(':');
              setTime({ hh: h, min: m, period: p || 'AM' });
            }
            
            if (ev.date) {
              const d = new Date(ev.date);
              setDate({
                dd: String(d.getDate()).padStart(2, '0'),
                mm: String(d.getMonth() + 1).padStart(2, '0'),
                yyyy: String(d.getFullYear())
              });
            }
          }
        })
        .catch(err => console.error("Error loading event:", err));
    } else {
      // Reset form when switching to 'Create New Event' mode
      setTitle('');
      setDescription('');
      setVenue('');
      setTime({ hh: '09', min: '00', period: 'AM' });
      setAdminLink('');
      setRegisterLink('');
      setInstagramLink('');
      setTickets([{ name: 'Standard Ticket', price: '' }]);
      setStatus('Draft');
      setBannerImage('');
      setDate({ dd: '', mm: '', yyyy: '' });
    }
  }, [eventId, isNewEvent, API_URL]);

  const handleSave = async () => {
    if (!title || !date.dd || !date.mm || !date.yyyy) {
      alert("Please fill in the Event Name and Date.");
      return;
    }

    if (!selectedSociety) {
      alert("Please select a society for this event.");
      return;
    }

    const eventData = {
      title,
      description,
      date: `${date.yyyy}-${date.mm}-${date.dd}`,
      time: `${time.hh}:${time.min} ${time.period}`,
      venue,
      adminLink,
      registerLink,
      instagramLink,
      tickets,
      status: 'Active',
      bannerImage,
      society: selectedSociety
    };

    const url = isNewEvent 
      ? `${API_URL}/api/events` 
      : `${API_URL}/api/events/${eventId}`;
    
    const method = isNewEvent ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (data.success) {
        alert(isNewEvent ? "Event Published Successfully!" : "Changes Saved Successfully!");
        navigate('/dashboard');
      } else {
        alert(`Failed to save: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error: Failed to connect to server");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert("Event Deleted");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event");
    }
  };

  // Simulated image upload
  const handleImageUpload = () => {
    const url = prompt("Please paste the image URL for your banner:", bannerImage || "https://via.placeholder.com/1200x400");
    if (url !== null) {
      // Simple validation: check if it looks like a URL
      if (url.trim() === "" || url.startsWith("http")) {
        setBannerImage(url.trim());
      } else {
        alert("Please enter a valid image URL (starting with http:// or https://)");
      }
    }
  };

  // Function to add a ticket tier (now capped at 5)
  const addTicketTier = () => {
    if (tickets.length < 5) {
      setTickets([...tickets, { name: '', price: '' }]);
    }
  };

  const removeTicketTier = (indexToRemove) => {
    setTickets(tickets.filter((_, index) => index !== indexToRemove));
  };

  const updateTicket = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  return (
    <div className="editor-page">
      <div className="admin-nav">
        <button className="back-link" onClick={() => navigate(-1)}>← Exit Editor</button>
        <div className="status-pill">Status: {isNewEvent ? 'Draft' : status}</div>
      </div>

      <div className="editor-container">
        <div 
          className="editor-hero" 
          style={{ 
            backgroundImage: bannerImage ? `url("${bannerImage}")` : 'none',
            backgroundColor: bannerImage ? 'transparent' : '#cbd5e1',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h2 style={{ 
            textShadow: bannerImage ? '0 2px 8px rgba(0,0,0,0.8)' : 'none', 
            color: bannerImage ? 'white' : 'inherit',
            zIndex: 2,
            position: 'relative',
            fontWeight: '800',
            letterSpacing: '1px'
          }}>
            {title.trim() ? title.toUpperCase() : (isNewEvent ? 'CREATE NEW EVENT' : 'EVENT NAME')}
          </h2>
          <button className="change-img-btn" onClick={handleImageUpload} style={{ zIndex: 2, position: 'relative' }}>
            📷 {bannerImage ? 'Change Banner' : 'Upload Banner'}
          </button>
          {bannerImage && <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 1
          }} />}
        </div>

        <div className="editor-grid">
          <div className="editor-main">
            <div className="input-group">
              <label>Event Name</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Hackathon 2026" 
              />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="input-group" style={{ flex: 1.5 }}>
                <label>Date (Day / Month / Year)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" placeholder="DD" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={date.dd} 
                    onChange={(e) => setDate({...date, dd: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="MM" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={date.mm} 
                    onChange={(e) => setDate({...date, mm: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="YYYY" maxLength="4" 
                    style={{ textAlign: 'center', width: '80px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={date.yyyy} 
                    onChange={(e) => setDate({...date, yyyy: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group" style={{ flex: 1.5 }}>
                <label>Time</label>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <input 
                    type="text" placeholder="HH" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={time.hh} 
                    onChange={(e) => setTime({...time, hh: e.target.value})}
                  />
                  <span>:</span>
                  <input 
                    type="text" placeholder="MM" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={time.min} 
                    onChange={(e) => setTime({...time, min: e.target.value})}
                  />
                  <select 
                    style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }} 
                    value={time.period} 
                    onChange={(e) => setTime({...time, period: e.target.value})}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Place / Venue</label>
              <input 
                type="text" 
                placeholder="e.g., Main Auditorium or Online (Zoom)" 
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Select Society</label>
              <select 
                value={selectedSociety}
                onChange={(e) => setSelectedSociety(e.target.value)}
                style={{ padding: '14px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', width: '100%' }}
              >
                <option value="">Select a society...</option>
                {societies.map(society => (
                  <option key={society._id} value={society._id}>
                    {society.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DYNAMIC TICKET TIERS SECTION */}
            <div className="input-group">
              <label>Ticket Pricing & Tiers (Max 5)</label>
              
              {tickets.map((ticket, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Standard" 
                    value={ticket.name}
                    onChange={(e) => updateTicket(index, 'name', e.target.value)}
                    style={{ flex: 1, padding: '14px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Price (e.g., Rs. 2500, Free)" 
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, 'price', e.target.value)}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                  />
                  
                  {tickets.length > 1 && (
                    <button 
                      onClick={() => removeTicketTier(index)}
                      style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              {tickets.length < 5 && (
                <button 
                  onClick={addTicketTier}
                  style={{ width: '100%', background: '#d1d5db', color: '#0f172a', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '5px' }}
                >
                  + Add Another Ticket Tier
                </button>
              )}
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6" 
                placeholder="Write all the exciting details about your event here..."
              />
            </div>
            
            <div className="admin-actions">
              <button className="save-btn" onClick={handleSave} style={{ background: '#0f172a', padding: '16px 40px', borderRadius: '12px' }}>
                {isNewEvent ? 'Publish Event' : 'Save Changes'}
              </button>
              {!isNewEvent && <button className="cancel-btn" onClick={handleDelete}>Delete Event</button>}
            </div>
          </div>

          <div className="editor-sidebar">
            <div className="input-group">
              <label>Participation Link</label>
              <input 
                type="url" 
                placeholder="https://forms.gle/..." 
                value={registerLink}
                onChange={(e) => setRegisterLink(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Instagram Link</label>
              <input 
                type="url" 
                placeholder="https://instagram.com/..." 
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   3. LEADER SOCIETY MANAGER (Profile View)
========================================== */
export const LeaderSocietyManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [society, setSociety] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/societies/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSociety(data.data.society);
          setEvents(data.data.events);
        } else {
          // 2. If backend returns error, use local fallback
          useLocalFallback();
        }
      })
      .catch(err => {
        console.error("Backend unreachable, using local fallback:", err);
        useLocalFallback();
      });

    // Local fallback logic for demos
    function useLocalFallback() {
      const mockSocieties = [
        { _id: "rotaract-club", name: "ROTARACT CLUB", logo: "/images-e/societies/rotaract-club.png" },
        { _id: "ieee-club", name: "IEEE CLUB", logo: "/images-e/societies/ieee-club.png" },
        { _id: "bizlink-society", name: "BIZLINK SOCIETY", logo: "" },
        { _id: "iit-sports-club", name: "IIT SPORTS CLUB", logo: "" }
      ];
      
      const found = mockSocieties.find(s => s._id === id);
      if (found) {
        setSociety(found);
        setEvents([{ _id: "mock-1", title: `${found.name} EVENT 1`, status: "Active" }]);
      }
    }
  }, [id, API_URL]);

  if (!society) return <div className="loading">Loading Admin Space...</div>;

  return (
    <div className="manager-page">
      <header className="manager-header">
        <button className="back-link" onClick={() => navigate('/')}>← Dashboard</button>
        <div className="manager-profile">
          <div className="manager-logo" style={{ backgroundImage: `url(${society.logo})`, backgroundSize: 'cover' }}>
            {!society.logo && "Logo"}
          </div>
          <h1>{society.name} Admin Space</h1>
          <button className="edit-profile-btn">Edit Society Profile</button>
        </div>
      </header>

      <section className="manager-events">
        <div className="manager-events-header">
          <h3>Managed Events</h3>
          <button className="small-add-btn" onClick={() => navigate('/admin/event/new')}>+ Add Event</button>
        </div>
        <div className="manager-grid">
          {events.filter(e => e.status === 'Active' || e.status === 'Featured').map((ev, i) => (
            <LeaderEventBanner key={`managed-${i}`} id={ev._id} title={ev.title} />
          ))}
          {events.filter(e => e.status !== 'Active' && e.status !== 'Featured').length === 0 && events.length === 0 && (
            <div className="leader-empty">No managed events yet.</div>
          )}
        </div>
      </section>

      <section className="manager-events" style={{ marginTop: '20px' }}>
        <div className="manager-events-header">
          <h3>Drafted / Past Events</h3>
        </div>
        <div className="manager-grid">
          {events.filter(e => e.status === 'Draft' || e.status === 'Archived' || !e.status).map((ev, i) => (
            <LeaderEventBanner key={`draft-${i}`} id={ev._id} title={ev.title} />
          ))}
          {events.filter(e => e.status === 'Draft' || e.status === 'Archived' || !e.status).length === 0 && (
            <div className="leader-empty">No drafted or past events.</div>
          )}
        </div>
      </section>
    </div>
  );
};


/* ==========================================
   4. STUDENT DASHBOARD VIEW (Previously Weekly Report)
========================================== */
export const LeaderReport = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-nav" style={{ maxWidth: '1000px', margin: '0 auto 20px' }}>
        <button className="back-link" onClick={() => navigate('/')}>← Back to Dashboard</button>
      </div>

      {/* FIX: Removed minHeight: '800px' so the box hugs the content naturally */}
      <div className="editor-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 50px', paddingBottom: '50px' }}>
        
        {/* Report Header */}
        <div className="admin-header" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '25px', marginBottom: '35px', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 8px 0' }}>Student Dashboard View</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Previewing as a Student Member</p>
          </div>
          <button className="publish-btn" onClick={() => navigate('/dashboard')}>
            Student Dashboard {'>'}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="leader-row-grid" style={{ marginBottom: '40px' }}>
          <div className="admin-stat-box" style={{ margin: 0 }}>
            <span>Total Views</span>
            <strong>1,240</strong>
          </div>
          <div className="admin-stat-box" style={{ margin: 0 }}>
            <span>Registrations</span>
            <strong>428</strong>
          </div>
          <div className="admin-stat-box" style={{ margin: 0 }}>
            <span>Revenue</span>
            <strong>$3,500</strong>
          </div>
        </div>

        {/* Detailed Table Section */}
        <h3 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '18px' }}>Top Performing Events</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '40px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '14px' }}>
              <th style={{ padding: '12px 10px' }}>Event Name</th>
              <th style={{ padding: '12px 10px' }}>Date</th>
              <th style={{ padding: '12px 10px' }}>Status</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Signups</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px 10px', fontWeight: '600', color: '#0f172a' }}>Main Hackathon 2026</td>
              <td style={{ padding: '16px 10px', color: '#64748b' }}>Feb 20, 2026</td>
              <td style={{ padding: '16px 10px' }}><span className="status-pill" style={{ fontSize: '12px' }}>Completed</span></td>
              <td style={{ padding: '16px 10px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>310</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px 10px', fontWeight: '600', color: '#0f172a' }}>React Workshop</td>
              <td style={{ padding: '16px 10px', color: '#64748b' }}>Feb 22, 2026</td>
              <td style={{ padding: '16px 10px' }}><span className="status-pill" style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1' }}>Active</span></td>
              <td style={{ padding: '16px 10px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>85</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '16px 10px', fontWeight: '600', color: '#0f172a' }}>Charity Runs</td>
              <td style={{ padding: '16px 10px', color: '#64748b' }}>Feb 18, 2026</td>
              <td style={{ padding: '16px 10px' }}><span className="status-pill" style={{ fontSize: '12px' }}>Completed</span></td>
              <td style={{ padding: '16px 10px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>33</td>
            </tr>
          </tbody>
        </table>

        {/* NEW: Extra Options Section to fill the void cleanly */}
        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
          <div>
            <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '16px' }}>Need deeper insights?</h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Download the raw CSV data to view attendee emails and demographics.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 'bold', cursor: 'pointer' }}>Share Report</button>
            <button style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Export Full CSV</button>
          </div>
        </div>

      </div>
    </div>
  );
};