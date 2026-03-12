import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Leader.css';
import { LeaderEventBanner, LeaderEventRow, LeaderSidebar, LeaderSocietyCard } from '../components/LeaderEvent';


/* ==========================================
   1. LEADER DASHBOARD
========================================== */
export const LeaderDashboard = () => {
  const navigate = useNavigate(); // <-- Added this to handle navigation
  const societies = ["Rotaract Club", "IEEE Club", "Mozilla Club"];
  const myPublishedEvents = ["main-hackathon-2026", "rec-event-1", "rec-event-2"];

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <div className="admin-left">
          <header className="admin-header">
            <div>
              <h1>Society Leader Portal</h1>
              <p>Welcome back, Admin</p>
            </div>
            {/* Added the onClick to route to our "new" event page */}
            <button className="publish-btn" onClick={() => navigate('/event/new')}>
              + Create New Event
            </button>
          </header>
          
          <section className="admin-main-event">
            <h3>Featured Society Event</h3>
            <LeaderEventBanner large id="main-hackathon-2026" />
          </section>

          <LeaderEventRow title="Active Events" events={myPublishedEvents} />
          <LeaderEventRow title="Drafted/Past Events" events={["old-event-1"]} />
        </div>

        <div className="admin-right">
          <LeaderSidebar title="Engagement Overview" />
          <div className="manage-societies">
            <h3>Your Societies</h3>
            {societies.map(s => <LeaderSocietyCard key={s} name={s} />)}
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
  
  // State for dynamic ticket tiers
  const [tickets, setTickets] = useState([{ name: 'Standard Ticket', price: '' }]);
  
  const isNewEvent = eventId === 'new';
  const displayTitle = isNewEvent ? '' : eventId?.replace(/-/g, ' ');

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
        <div className="status-pill">Status: {isNewEvent ? 'Draft' : 'Published'}</div>
      </div>

      <div className="editor-container">
        <div className="editor-hero">
          <h2>{isNewEvent ? 'CREATE NEW EVENT' : displayTitle?.toUpperCase()}</h2>
          <button className="change-img-btn">
            📷 {isNewEvent ? 'Upload Banner' : 'Change Banner'}
          </button>
        </div>

        <div className="editor-grid">
          <div className="editor-main">
            <div className="input-group">
              <label>Event Name</label>
              <input type="text" defaultValue={displayTitle} placeholder="e.g., Annual Hackathon 2026" />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div className="input-group" style={{ flex: 1.5 }}>
                <label>Date (Day / Month / Year)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="DD" maxLength="2" style={{ textAlign: 'center' }} />
                  <input type="text" placeholder="MM" maxLength="2" style={{ textAlign: 'center' }} />
                  <input type="text" placeholder="YYYY" maxLength="4" style={{ textAlign: 'center' }} />
                </div>
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Time</label>
                <input type="time" />
              </div>
            </div>

            <div className="input-group">
              <label>Place / Venue</label>
              <input type="text" placeholder="e.g., Main Auditorium or Online (Zoom)" />
            </div>

            {/* DYNAMIC TICKET TIERS SECTION */}
            <div className="input-group">
              <label>Ticket Pricing & Tiers (Max 5)</label>
              
              {tickets.map((ticket, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Tier Name (e.g., VIP, Balcony)" 
                    value={ticket.name}
                    onChange={(e) => updateTicket(index, 'name', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Price (e.g., Rs. 2500, Free)" 
                    value={ticket.price}
                    onChange={(e) => updateTicket(index, 'price', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  
                  {/* Only show the Remove button if there is more than 1 row */}
                  {tickets.length > 1 && (
                    <button 
                      onClick={() => removeTicketTier(index)}
                      style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}
                      title="Remove Tier"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              
              {/* Only show the Add button if there are less than 5 tiers */}
              {tickets.length < 5 ? (
                <button 
                  onClick={addTicketTier}
                  style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '5px' }}
                >
                  + Add Another Ticket Tier
                </button>
              ) : (
                <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', marginTop: '5px', display: 'inline-block' }}>
                  Maximum of 5 ticket tiers reached.
                </span>
              )}
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                defaultValue={isNewEvent ? '' : "Standard event description text..."} 
                rows="5" 
                placeholder="Write all the exciting details about your event here..."
              />
            </div>
            
            <div className="admin-actions">
              <button className="save-btn">
                {isNewEvent ? 'Publish Event' : 'Save Changes'}
              </button>
              {!isNewEvent && <button className="cancel-btn">Delete Event</button>}
            </div>
          </div>

          <div className="editor-sidebar">
            {/* The Total Registrations block has been completely removed from here! */}
            
            <div className="input-group">
              <label>Administration Link</label>
              <input type="url" placeholder="https://docs.google.com/..." />
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
  const societyEvents = ["soc-event-1", "soc-event-2"];

  return (
    <div className="manager-page">
      <header className="manager-header">
        <button className="back-link" onClick={() => navigate('/')}>← Dashboard</button>
        <div className="manager-profile">
          <div className="manager-logo">Logo</div>
          <h1>{id?.replace(/-/g, ' ')} Admin Space</h1>
          <button className="edit-profile-btn">Edit Society Profile</button>
        </div>
      </header>

      <hr className="admin-divider" />

      <section className="manager-events">
        <div className="manager-events-header">
          <h3>Managed Events</h3>
          <button className="small-add-btn" onClick={() => navigate('/event/new')}>+ Add Event</button>
        </div>
        <div className="manager-grid">
          {societyEvents.map((ev, i) => (
            <LeaderEventBanner key={i} id={ev} />
          ))}
        </div>
      </section>
    </div>
  );
};


/* ==========================================
   4. LEADER REPORT VIEW
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
            <h1 style={{ fontSize: '26px', color: '#0f172a', margin: '0 0 8px 0' }}>Weekly Engagement Report</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>Period: Feb 16, 2026 - Feb 23, 2026</p>
          </div>
          <button className="publish-btn" onClick={() => alert("Downloading PDF...")}>
            ⬇ Download PDF
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