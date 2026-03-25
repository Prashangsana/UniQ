import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css'; 
import MiniCalendar from '../components/MiniCalendar';

const MentorDashboardPeer = () => {
  const today = new Date();

  // Added hidden 'dateObj' to track the actual dates on the calendar
  const [requests, setRequests] = useState([
    { id: 1, student: 'Jordan Smith', topic: 'React Context API', time: 'Mon, 10:00 AM', dateObj: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2) },
    { id: 2, student: 'Casey Lee', topic: 'Python Data Structures', time: 'Tue, 2:00 PM', dateObj: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3) }
  ]);

  const [sessions, setSessions] = useState([
    { 
      id: 3, 
      student: 'Morgan Davis', 
      topic: 'Java OOP Basics', 
      time: 'Tomorrow at 11:00 AM',
      link: 'https://zoom.us/j/1122334455',
      dateObj: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Tomorrow
    }
  ]);

  // DYNAMIC CALENDAR: It now automatically looks at whatever is in the 'sessions' array!
  const bookedDates = sessions.map(session => session.dateObj);

  const handleAccept = (request) => {
    // Moves the request to sessions, taking the dateObj with it!
    setSessions([...sessions, { ...request, time: 'Scheduled: ' + request.time, link: 'https://zoom.us/j/9988776655' }]);
    setRequests(requests.filter(req => req.id !== request.id));
  };

  const handleDeny = (id) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">
        <h2>My Peer Mentoring Hub</h2>
        <p style={{ color: 'var(--body-text-gray)', marginBottom: '25px' }}>Manage your incoming student requests and upcoming sessions.</p>

        <div className="requests-section" style={{ marginBottom: '40px' }}>
          <h3>Pending Requests ({requests.length})</h3>
          {requests.length === 0 ? <p style={{ color: '#666', marginTop: '10px' }}>No new requests at the moment.</p> : null}
          
          {requests.map((req) => (
            <div key={req.id} className="booking-item" style={{ background: '#fff', border: '1px solid #ffeeba', borderLeft: '4px solid #ffc107' }}>
              <div className="lecturer-meta">
                <div className="lecturer-details">
                  <p className="lecturer-name">{req.student}</p>
                  <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>Topic: {req.topic}</p>
                  <small className="date-text">{req.time}</small>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => handleAccept(req)} style={{ background: '#28a745', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Accept</button>
                <button onClick={() => handleDeny(req.id)} style={{ background: '#dc3545', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Deny</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bookings-list">
          <h3>Upcoming Sessions</h3>
          {sessions.map((session) => (
            <div key={session.id} className="booking-item" style={{ background: '#f8f9fa', borderLeft: '4px solid var(--deep-navy)' }}>
              <div className="lecturer-meta">
                <div className="lecturer-details">
                  <p className="lecturer-name">{session.student}</p>
                  <span className="tag-pill">{session.topic}</span>
                </div>
              </div>
              <div className="status-info">
                <p className="status-text" style={{ color: 'var(--deep-navy)', fontWeight: 'bold' }}>Confirmed</p>
                <small className="date-text">{session.time}</small>
              </div>
              
              <button 
                className="calendar-link" 
                onClick={() => window.open(session.link, '_blank', 'noopener,noreferrer')}
                style={{ background: '#2D8CFF', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                <Icon icon="lucide:video" width="16" /> Start Meeting
              </button>
              
            </div>
          ))}
        </div>
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3>Work Schedule</h3>
          <div style={{ marginTop: '15px' }}>
            <MiniCalendar bookedDates={bookedDates} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MentorDashboardPeer;