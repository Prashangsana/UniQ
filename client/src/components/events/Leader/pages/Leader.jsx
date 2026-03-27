import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Leader.css';
import { LeaderEventBanner, LeaderEventRow, LeaderSidebar, LeaderSocietyCard } from '../components/LeaderEvent';

function useLeaderEventForm({ eventId, preselectedSocietyId }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const isNewEvent = eventId === 'new';

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
  const [canEdit, setCanEdit] = useState(true);
  const [manageableSocietyIds, setManageableSocietyIds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const authRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const authData = await authRes.json();
        if (!authData.authenticated) return;

        const admin = authData.user.role === 'admin';
        const userId = (authData.user?.id || authData.user?._id || '').toString();
        setIsAdmin(admin);
        setCurrentUserId(userId);

        const socRes = await fetch(`${API_URL}/api/societies`, { credentials: 'include' });
        const socData = await socRes.json();
        const list = socData.success ? (socData.data || []) : [];

        if (cancelled) return;

        setSocieties(list);

        const getSocietyKey = (s) => (s._id || s.id || s.shortName || '').toString();

        const allSocietyIds = list.map(getSocietyKey).filter(Boolean);
        const leaderSocietyIds = list
          .filter(s => {
            const leaderRaw = s.leader;
            const leaderId = (typeof leaderRaw === 'object' && leaderRaw?._id)
              ? leaderRaw._id.toString()
              : (leaderRaw || '').toString();
            return leaderId && userId && leaderId === userId;
          })
          .map(getSocietyKey)
          .filter(Boolean);

        const allowedSocietyIds = admin ? allSocietyIds : leaderSocietyIds;
        setManageableSocietyIds(allowedSocietyIds);

        if (isNewEvent) {
          setCanEdit(true);
          if (preselectedSocietyId) {
            const normalized = preselectedSocietyId.toString().toLowerCase();
            const match = list.find(s => {
              const societyId = getSocietyKey(s).toLowerCase();
              const shortName = (s.shortName || '').toString().toLowerCase();
              const slug = (s.name || '').toString().toLowerCase().replace(/\s+/g, '-');
              return societyId === normalized || shortName === normalized || slug === normalized;
            });
            const matchId = match ? getSocietyKey(match) : '';
            const matchLeaderRaw = match?.leader;
            const matchLeaderId = (typeof matchLeaderRaw === 'object' && matchLeaderRaw?._id)
              ? matchLeaderRaw._id.toString()
              : (matchLeaderRaw || '').toString();
            const canManageMatch = admin || (matchLeaderId && userId && matchLeaderId === userId);

            if (matchId && canManageMatch) {
              setSelectedSociety(matchId);
            } else {
              setSelectedSociety('');
            }
          } else if (list.length === 1) {
            const onlyId = getSocietyKey(list[0]);
            if (onlyId) setSelectedSociety(onlyId);
          }

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
          return;
        }

        const eventRes = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: { Accept: 'application/json' },
          credentials: 'include'
        });
        const eventData = await eventRes.json();
        if (!eventData.success) return;

        const ev = eventData.data;
        const eventSocietyId = (ev.society?._id || ev.society || '').toString();
        setCanEdit(admin || (eventSocietyId && allowedSocietyIds.includes(eventSocietyId)));

        setTitle(ev.title || '');
        setDescription(ev.description || '');
        setVenue(ev.venue || ev.location || '');
        setAdminLink(ev.adminLink || '');
        setRegisterLink(ev.registerLink || '');
        setInstagramLink(ev.instagramLink || '');
        setTickets(ev.tickets || ev.ticketTiers || [{ name: 'Standard Ticket', price: '' }]);
        setStatus(ev.status || 'Draft');
        setBannerImage(ev.bannerImage || '');
        setSelectedSociety(eventSocietyId);

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
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [eventId, isNewEvent, API_URL, preselectedSocietyId]);

  const handleSelectSociety = (value) => {
    if (!value) {
      setSelectedSociety('');
      return;
    }
    if (isAdmin) {
      setSelectedSociety(value);
      return;
    }

    const selected = societies.find(s => (s._id || s.id || s.shortName || '').toString() === value.toString());
    const leaderRaw = selected?.leader;
    const leaderId = (typeof leaderRaw === 'object' && leaderRaw?._id)
      ? leaderRaw._id.toString()
      : (leaderRaw || '').toString();

    if (leaderId && currentUserId && leaderId === currentUserId) {
      setSelectedSociety(value);
      return;
    }

    alert("You can't add an event to another society.");
    setSelectedSociety('');
  };

  const handleSave = async () => {
    if (!canEdit) {
      alert("You don't have permission to edit events for this society.");
      return;
    }

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
        // Navigate back to society profile if we came from one or if event belongs to a society
        const targetSocietyId = selectedSociety;
        if (targetSocietyId) {
          navigate(`/admin/society/${targetSocietyId}`, { state: { tab: 'leader' } });
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(`Failed to save: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error: Failed to connect to server");
    }
  };

  const handleSaveAsDraft = async () => {
    if (!canEdit) {
      alert("You don't have permission to edit events for this society.");
      return;
    }

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
      status: 'Draft',
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
        alert(isNewEvent ? "Event Saved as Draft!" : "Draft Updated Successfully!");
        // Navigate back to society profile if we came from one or if event belongs to a society
        const targetSocietyId = selectedSociety;
        if (targetSocietyId) {
          navigate(`/admin/society/${targetSocietyId}`, { state: { tab: 'leader' } });
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(`Failed to save draft: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Network error: Failed to connect to server");
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      alert("You don't have permission to delete events for this society.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert("Event Deleted");
        // Navigate back to society profile if we came from one or if event belongs to a society
        const targetSocietyId = preselectedSocietyId || selectedSociety;
        if (targetSocietyId) {
          navigate(`/admin/society/${targetSocietyId}`, { state: { tab: 'leader' } });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event");
    }
  };

  const handleImageUpload = () => {
    if (!canEdit) return;
    const url = prompt("Please paste the image URL for your banner:", bannerImage || "https://via.placeholder.com/1200x400");
    if (url !== null) {
      if (url.trim() === "" || url.startsWith("http")) {
        setBannerImage(url.trim());
      } else {
        alert("Please enter a valid image URL (starting with http:// or https://)");
      }
    }
  };

  const addTicketTier = () => {
    if (!canEdit) return;
    if (tickets.length < 5) {
      setTickets([...tickets, { name: '', price: '' }]);
    }
  };

  const removeTicketTier = (indexToRemove) => {
    if (!canEdit) return;
    setTickets(tickets.filter((_, index) => index !== indexToRemove));
  };

  const updateTicket = (index, field, value) => {
    if (!canEdit) return;
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  return {
    isNewEvent,
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
    time,
    setTime,
    venue,
    setVenue,
    registerLink,
    setRegisterLink,
    instagramLink,
    setInstagramLink,
    tickets,
    status,
    bannerImage,
    canEdit,
    societies,
    selectedSociety,
    setSelectedSociety,
    handleSelectSociety,
    handleSave,
    handleSaveAsDraft,
    handleDelete,
    handleImageUpload,
    addTicketTier,
    removeTicketTier,
    updateTicket
  };
}

function LeaderEventFormBody({
  isNewEvent,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  venue,
  setVenue,
  registerLink,
  setRegisterLink,
  instagramLink,
  setInstagramLink,
  tickets,
  bannerImage,
  canEdit,
  societies,
  selectedSociety,
  handleSelectSociety,
  handleSave,
  handleSaveAsDraft,
  handleDelete,
  handleImageUpload,
  addTicketTier,
  removeTicketTier,
  updateTicket
}) {
  return (
    <div className="editor-container leader-event-form-card">
        <div 
          className="editor-hero" 
          style={{ 
            backgroundImage: bannerImage ? `url("${bannerImage}")` : 'none',
            backgroundColor: bannerImage ? 'transparent' : '#d8e4f0',
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
          <button className="change-img-btn" onClick={handleImageUpload} disabled={!canEdit} style={{ zIndex: 2, position: 'relative' }}>
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
                disabled={!canEdit}
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
                    disabled={!canEdit}
                  />
                  <input 
                    type="text" placeholder="MM" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={date.mm} 
                    onChange={(e) => setDate({...date, mm: e.target.value})}
                    disabled={!canEdit}
                  />
                  <input 
                    type="text" placeholder="YYYY" maxLength="4" 
                    style={{ textAlign: 'center', width: '80px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={date.yyyy} 
                    onChange={(e) => setDate({...date, yyyy: e.target.value})}
                    disabled={!canEdit}
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
                    disabled={!canEdit}
                  />
                  <span>:</span>
                  <input 
                    type="text" placeholder="MM" maxLength="2" 
                    style={{ textAlign: 'center', width: '60px', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} 
                    value={time.min} 
                    onChange={(e) => setTime({...time, min: e.target.value})}
                    disabled={!canEdit}
                  />
                  <select 
                    style={{ padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer' }} 
                    value={time.period} 
                    onChange={(e) => setTime({...time, period: e.target.value})}
                    disabled={!canEdit}
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
                disabled={!canEdit}
              />
            </div>

            <div className="input-group">
              <label>Select Society</label>
              <select 
                value={selectedSociety}
                onChange={(e) => handleSelectSociety(e.target.value)}
                style={{ padding: '14px', borderRadius: '15px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', width: '100%' }}
                disabled={!canEdit}
              >
                <option value="">Select a society</option>
                {societies.map(society => {
                  const societyKey = (society._id || society.id || society.shortName || '').toString();
                  return (
                  <option key={societyKey || society.name} value={societyKey}>
                    {society.name}
                  </option>
                  );
                })}
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
                    disabled={!canEdit}
                  />
                  <input 
                    type="text" 
                    placeholder="Price (e.g., Rs. 2500, Free)" 
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, 'price', e.target.value)}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                    disabled={!canEdit}
                  />
                  
                  {tickets.length > 1 && (
                    <button 
                      onClick={() => removeTicketTier(index)}
                      disabled={!canEdit}
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
                  disabled={!canEdit}
                  style={{ width: '100%', background: '#d1d5db', color: '#0f172a', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '5px' }}
                >
                  + Add Another Ticket Tier
                </button>
              )}
            </div>

            <div className="input-group">
              <label>Participation Link</label>
              <input 
                type="url" 
                placeholder="https://forms.gle/..." 
                value={registerLink}
                onChange={(e) => setRegisterLink(e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div className="input-group">
              <label>Instagram Link</label>
              <input 
                type="url" 
                placeholder="https://instagram.com/..." 
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6" 
                placeholder="Write all the exciting details about your event here..."
                disabled={!canEdit}
              />
            </div>
            
            <div className="admin-actions">
              <button className="save-btn" onClick={handleSave} disabled={!canEdit} style={{ background: '#0f172a', padding: '16px 40px', borderRadius: '12px' }}>
                {isNewEvent ? 'Publish Event' : 'Publish Event'}
              </button>
              <button className="save-btn" onClick={handleSaveAsDraft} disabled={!canEdit} style={{ background: '#64748b', padding: '16px 40px', borderRadius: '12px', marginLeft: '10px' }}>
                {isNewEvent ? 'Draft Event' : 'Save as Draft'}
              </button>
              {!isNewEvent && canEdit && <button className="cancel-btn" onClick={handleDelete}>Delete Event</button>}
            </div>
          </div>
        </div>
      </div>
  );
};

/* ==========================================
   1. LEADER DASHBOARD
========================================== */
export const LeaderDashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const createForm = useLeaderEventForm({ eventId: 'new', preselectedSocietyId: null });

  const [societies, setSocieties] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [userName, setUserName] = useState('Leader');
  const [manageableSocietyIds, setManageableSocietyIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const authData = await authRes.json();
        
        if (!authData.authenticated) return;
        setUserName(authData.user.name);
        
        const isAdmin = authData.user.role === 'admin';
        const userId = authData.user.id || authData.user._id;

        const socUrl = `${API_URL}/api/societies`;
        const socRes = await fetch(socUrl, { credentials: 'include' });
        const socData = await socRes.json();
        if (socData.success) {
           setSocieties(socData.data || []);
        }

        if (isAdmin) {
          setManageableSocietyIds((socData.data || []).map(s => s._id?.toString()).filter(Boolean));
        } else {
          const leaderSocRes = await fetch(`${API_URL}/api/societies/leader/all`, { credentials: 'include' });
          const leaderSocData = await leaderSocRes.json();
          if (leaderSocData.success) {
            setManageableSocietyIds((leaderSocData.data || []).map(s => s._id?.toString()).filter(Boolean));
          } else {
            setManageableSocietyIds([]);
          }
        }

        const evtUrl = isAdmin ? `${API_URL}/api/events` : `${API_URL}/api/events/leader/${userId}`;
        const evtRes = await fetch(evtUrl, { credentials: 'include' });
        const evtData = await evtRes.json();
        if (evtData.success && evtData.data) {
           const allEvents = evtData.data;
           setActiveEvents(allEvents.filter(e => e.status === 'Active' || e.status === 'Featured').map(e => e._id));
           setDraftEvents(allEvents.filter(e => e.status === 'Draft').map(e => e._id));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [API_URL]);

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <div className="admin-left">
          <header className="admin-header admin-header--leader-portal">
            <div className="admin-header__intro">
              <h1>Society Leader Portal</h1>
              <p>Welcome back, {userName}</p>
            </div>
          </header>

          <div className="leader-dashboard-create">
            <LeaderEventFormBody {...createForm} />
          </div>
        </div>

        <div className="admin-right">
          <div className="societies-section">
            <div className="societies-section-head">
              <h3>Your societies</h3>
            </div>
            <div className="societies-list">
              {societies.map(s => (
                <LeaderSocietyCard
                  key={s._id || s.shortName || s.name}
                  id={s._id || s.id}
                  shortName={s.shortName}
                  name={s.name}
                  logo={s.logo}
                  canManage={manageableSocietyIds.includes((s._id || s.id)?.toString())}
                />
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
  const queryParams = new URLSearchParams(location.search);
  const preselectedSocietyId = queryParams.get('societyId');
  const form = useLeaderEventForm({ eventId, preselectedSocietyId });

  return (
    <div className="editor-page">
      <div className="admin-nav">
        <button className="back-link" onClick={() => navigate(-1)}>← Exit Editor</button>
        <div className="status-pill">Status: {form.isNewEvent ? 'Draft' : form.status}</div>
      </div>
      <LeaderEventFormBody {...form} />
    </div>
  );
};

/* ==========================================
   3. LEADER SOCIETY — CREATE / EDIT (saved to DB)
========================================== */
export const LeaderSocietyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const isNew = location.pathname.endsWith('/new');

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [canEdit, setCanEdit] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const authRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const authData = await authRes.json();
        if (!authData.authenticated) return;

        const admin = authData.user?.role === 'admin';
        if (cancelled) return;
        setIsAdmin(admin);

        if (isNew) {
          setCanEdit(admin);
          return;
        }

        if (!id) return;

        if (!admin) {
          const socRes = await fetch(`${API_URL}/api/societies/leader/all`, { credentials: 'include' });
          const socData = await socRes.json();
          const allowed = socData.success && (socData.data || []).some(s => s._id?.toString() === id?.toString());
          if (cancelled) return;
          setCanEdit(allowed);
        } else {
          setCanEdit(true);
        }

        const res = await fetch(`${API_URL}/api/societies/${id}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.data?.society) {
          const s = data.data.society;
          setName(s.name || '');
          setShortName(s.shortName || '');
          setDescription(s.description || '');
          setLogo(s.logo || '');
        }
      } catch (err) {
        console.error('Error loading society:', err);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, API_URL, isNew]);

  const handleLogoPrompt = () => {
    if (!canEdit) return;
    const url = prompt('Paste image URL for the club logo:', logo || 'https://');
    if (url !== null) setLogo(url.trim());
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert("Only admins can delete societies.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this society? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_URL}/api/societies/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        alert("Society deleted successfully");
        navigate('/', { state: { tab: 'leader' } });
      } else {
        alert(data.message || "Failed to delete society");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete society");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("You don't have permission to edit this society.");
      return;
    }
    if (!name.trim() || !shortName.trim() || !description.trim()) {
      alert('Please fill in full name, short name, and description.');
      return;
    }
    const body = {
      name: name.trim(),
      shortName: shortName.trim(),
      description: description.trim(),
      logo: logo.trim()
    };
    try {
      const url = isNew ? `${API_URL}/api/societies` : `${API_URL}/api/societies/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        const savedId = data.data?._id || id;
        alert(isNew ? 'Society published successfully!' : 'Society updated.');
        navigate(`/admin/society/${savedId}`, { state: { tab: 'leader' } });
      } else {
        alert(data.message || 'Could not save society.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error — could not save.');
    }
  };

  return (
    <div className="editor-page society-editor-page">
      <div className="admin-nav">
        <button type="button" className="back-link" onClick={() => navigate('/', { state: { tab: 'leader' } })}>← Back</button>
        <div className="status-pill">{isNew ? 'New club / society' : (canEdit ? 'Edit society' : 'View only')}</div>
      </div>

      <div className="editor-container">
        <div
          className="editor-hero society-editor-hero"
          style={{
            backgroundImage: logo ? `url("${logo}")` : 'none',
            backgroundColor: logo ? 'transparent' : '#d8e4f0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <h2 style={{
            textShadow: logo ? '0 2px 8px rgba(0,0,0,0.85)' : 'none',
            color: logo ? '#fff' : '#0f172a',
            zIndex: 2,
            position: 'relative',
            fontWeight: 800,
            letterSpacing: '0.06em',
            fontSize: '1.35rem',
            textAlign: 'center',
            margin: 0
          }}>
            {isNew ? 'ADD NEW SOCIETY OR CLUB' : 'EDIT SOCIETY'}
          </h2>
          <button type="button" className="change-img-btn" onClick={handleLogoPrompt} disabled={!canEdit} style={{ zIndex: 2, position: 'relative' }}>
            {logo ? 'Change logo URL' : 'Set logo (image URL)'}
          </button>
          {logo && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.25)',
              zIndex: 1
            }} />
          )}
        </div>

        <form className="editor-grid society-editor-form" onSubmit={handleSubmit}>
          <div className="editor-main">
            <div className="input-group">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rotaract Club of IIT"
                required
                disabled={!canEdit}
              />
            </div>

            <div className="input-group">
              <label>Short name</label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g., ROTARACT"
                required
                disabled={!canEdit}
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="What does your club do? Who can join?"
                required
                disabled={!canEdit}
              />
            </div>

            <div className="admin-actions">
              <button type="submit" className="save-btn" disabled={!canEdit} style={{ background: '#0f172a', padding: '16px 40px', borderRadius: '12px' }}>
                {isNew ? 'Publish society' : 'Save changes'}
              </button>
              {!isNew && isAdmin && (
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleDelete}
                  style={{ background: '#dc2626', padding: '16px 40px', borderRadius: '12px' }}
                >
                  Delete society
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ==========================================
   4. LEADER SOCIETY MANAGER (Profile View)
========================================== */
export const LeaderSocietyManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [society, setSociety] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const authRes = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const authData = await authRes.json();
        if (!authData.authenticated) return;
        setCurrentUserId((authData.user?.id || authData.user?._id || '').toString());
        
        if (authData.user.role === 'admin') {
          setIsAdmin(true);
          setIsLeader(true);
        }
      } catch (err) {
        console.error("Error checking leader access:", err);
      } finally {
        setAccessChecked(true);
      }
    };
    checkAccess();
  }, [id, API_URL]);

  useEffect(() => {
    if (!accessChecked) return;

    fetch(`${API_URL}/api/societies/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSociety(data.data.society);
          setEvents(data.data.events);

          if (isAdmin) return;

          if (currentUserId) {
            const leaderRaw = data.data.society?.leader;
            const leaderId = (typeof leaderRaw === 'object' && leaderRaw?._id)
              ? leaderRaw._id.toString()
              : (leaderRaw || '').toString();
            setIsLeader(leaderId && leaderId === currentUserId);
          } else {
            setIsLeader(false);
          }
        }
      })
      .catch(err => {
        console.error("Backend unreachable:", err);
      });
  }, [id, API_URL, currentUserId, isAdmin, accessChecked]);

  return (
    <div className="manager-page">
      <div className="navigation-header">
        <button
          type="button"
          className="back-btn"
          onClick={() => {
            const tab = location.state?.tab ?? 'leader';
            navigate('/', { state: { tab } });
          }}
        >
          ← Back
        </button>
      </div>

      <header className="manager-header">
        <div className="manager-profile">
          <div className="manager-logo" style={{ backgroundImage: society ? `url(${society.logo})` : undefined, backgroundSize: 'cover' }}>
            {society && !society.logo && 'Logo'}
          </div>
          <h1>{society ? `${society.name} Admin Space` : 'Admin Space'}</h1>
          {isLeader && (
            <button
              type="button"
              className="edit-profile-btn"
              onClick={() => society && navigate(`/admin/society/${id}/edit`, { state: { tab: 'leader' } })}
            >
              Edit Society Profile
            </button>
          )}
        </div>
      </header>

      <section className="manager-events">
        <div className="manager-events-header">
          <h3>Managed Events</h3>
          {isLeader && <button className="small-add-btn" onClick={() => navigate(`/admin/event/new?societyId=${id}`, { state: { tab: 'leader' } })}>+ Add Event</button>}
        </div>
        <div className="manager-grid">
          {events.filter(e => e.status === 'Active' || e.status === 'Featured').map((ev, i) => (
            <LeaderEventBanner key={`managed-${i}`} id={ev._id} title={ev.title} image={ev.bannerImage} editable={isLeader} />
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
            <LeaderEventBanner key={`draft-${i}`} id={ev._id} title={ev.title} image={ev.bannerImage} editable={isLeader} />
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
