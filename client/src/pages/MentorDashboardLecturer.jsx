import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css';
import MiniCalendar from '../components/MiniCalendar';

// FIX 1: use environment variable instead of hardcoded localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MentorDashboardLecturer = () => {
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // FIX 2: added credentials: 'include' so the session cookie is sent
        const res = await fetch(`${API_URL}/api/mentoring/appointments?mentorId=${currentUserId}`, {
          credentials: 'include'
        });
        const data = await res.json();

        const formattedData = data.map(app => ({
          ...app,
          dateObj: new Date(app.date)
        }));

        setSessions(formattedData.filter(app => app.status === 'Accepted'));
        setRequests(formattedData.filter(app => app.status === 'Pending'));
      } catch (err) {
        console.error("Failed to load lecturer data:", err);
      }
    };
    fetchAppointments();
  }, [currentUserId]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // FIX 2: added credentials: 'include'
      const res = await fetch(`${API_URL}/api/mentoring/status/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedApp = await res.json();
        if (newStatus === 'Accepted') {
          setSessions(prev => [...prev, { ...updatedApp, dateObj: new Date(updatedApp.date) }]);
          setRequests(prev => prev.filter(req => req._id !== id));
        } else {
          setRequests(prev => prev.filter(req => req._id !== id));
        }
      }
    } catch (err) {
      alert("Error updating appointment status");
    }
  };

  const bookedDates = sessions.map(session => session.dateObj);

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">
        <h2>Faculty Dashboard</h2>
        <p style={{ color: 'var(--body-text-gray)', marginBottom: '25px' }}>Review student consultation requests and your availability.</p>

        <div className="requests-section" style={{ marginBottom: '40px' }}>
          <h3>Pending Consultations ({requests.length})</h3>
          {requests.length === 0 ? <p style={{ color: '#666', marginTop: '10px' }}>No new requests at the moment.</p> : null}

          {requests.map((req) => (
            <div key={req._id} className="booking-item" style={{ background: '#fff', border: '1px solid #ffeeba', borderLeft: '4px solid #ffc107' }}>
              <div className="lecturer-meta">
                <div className="lecturer-details">
                  <p className="lecturer-name">{req.studentName}</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>Reason: {req.topic}</p>
                  <small className="date-text">{req.date} at {req.time}</small>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => handleUpdateStatus(req._id, 'Accepted')} style={{ background: '#28a745', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Approve</button>
                <button onClick={() => handleUpdateStatus(req._id, 'Declined')} style={{ background: '#dc3545', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Decline</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bookings-list">
          <h3>Confirmed Appointments</h3>
          {sessions.length === 0 ? <p style={{ color: '#666', marginTop: '10px' }}>No confirmed sessions yet.</p> : null}
          {sessions.map((session) => (
            <div key={session._id} className="booking-item" style={{ background: '#f8f9fa', borderLeft: '4px solid var(--deep-navy)' }}>
              <div className="lecturer-meta">
                <div className="lecturer-details">
                  <p className="lecturer-name">{session.studentName}</p>
                  <span className="tag-pill">{session.topic}</span>
                </div>
              </div>
              <div className="status-info">
                <p className="status-text" style={{ color: 'var(--deep-navy)', fontWeight: 'bold' }}>Confirmed</p>
                <small className="date-text">{session.date} at {session.time}</small>
              </div>
              {session.link && session.link !== '#' && (
                <button
                  className="calendar-link"
                  onClick={() => window.open(session.link, '_blank', 'noopener,noreferrer')}
                  style={{ background: '#2D8CFF', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  <Icon icon="lucide:video" width="16" /> Join
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3>Consultation Calendar</h3>
          <div style={{ marginTop: '15px' }}>
            <MiniCalendar bookedDates={bookedDates} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MentorDashboardLecturer;