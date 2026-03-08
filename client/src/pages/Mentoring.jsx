import React from 'react';
import './Mentoring.css';

const Mentoring = () => {
  const expertise = [
    { title: 'ML', img: 'ml-link' },
    { title: 'Backend', img: 'be-link' },
    { title: 'Frontend', img: 'fe-link' },
    { title: 'Database', img: 'db-link' }
  ];

  const bookings = [
    { name: 'Ms. Nilaskshi', tag: 'ML', status: '1 day to go', date: 'On 1st December 2025' },
    { name: 'Ms. Sankeetha', tag: 'OOP', status: 'Requested', date: '' }, // Fixed the typo here!
    { name: 'Mr. Suresh', tag: 'Backend', status: 'Accepted', date: '' }
  ];

  return (
    <div className="mentoring-container">
      {/* Navbar Section */}
      <nav className="mentoring-navbar">
        <div className="nav-left">
          <div className="profile-circle">👤</div>
          <div className="add-button-icon">➕</div>
        </div>
        <div className="nav-links">
          <span>Home</span>
          <span>Groups</span>
          <span>Event</span>
          <span>Profile</span>
          <span className="active-tab">Mentoring</span>
          <span>About</span>
          <button className="logout-btn">Sign out</button>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="mentoring-layout">
        
        {/* Left Side: Booking & List */}
        <main className="booking-area">
          <div className="expertise-hero-card">
            <h2>Lecturer Expertise Booking</h2>
            <div className="expertise-row">
              {expertise.map((item) => (
                <div key={item.title} className="lecturer-card">
                  <span className="expertise-pill">{item.title}</span>
                  <div className="avatar-placeholder"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bookings-list">
            <h3>Your bookings</h3>
            {bookings.map((booking, idx) => (
              <div key={idx} className="booking-item">
                <div className="lecturer-meta">
                  <div className="mini-avatar"></div>
                  <div className="lecturer-details">
                    <p className="lecturer-name">{booking.name}</p>
                    <span className="tag-pill">{booking.tag}</span>
                  </div>
                </div>
                <div className="status-info">
                  <p className="status-text">{booking.status}</p>
                  <small className="date-text">{booking.date}</small>
                </div>
                <button className="calendar-link">View Calendar &gt;</button>
              </div>
            ))}
          </div>
        </main>

        {/* Right Side: Sidebar */}
        <aside className="mentoring-sidebar">
          <div className="sidebar-section">
            <h3>Your mentors &gt;</h3>
            <div className="mentor-block"></div>
            <div className="mentor-block"></div>
            <div className="mentor-block"></div>
          </div>
          <hr className="sidebar-divider" />
          <div className="sidebar-section">
            <h3>Calendar</h3>
            <div className="calendar-widget"></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Mentoring;