import React, { useState, useEffect } from 'react'; // Added useEffect
import { Icon } from '@iconify/react';
import './Mentoring.css'; 
import MiniCalendar from '../components/MiniCalendar';

const LecturerMentoring = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Dynamic states for Backend data
  const [bookings, setBookings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch ALL Mentors, but ONLY save the Faculty ones
        const mentorRes = await fetch('http://localhost:5000/api/mentoring/mentors');
        const mentorData = await mentorRes.json();
        setLecturers(mentorData.filter(m => m.role === 'faculty')); // <-- THIS IS THE FIX

        // Fetch ALL Appointments for Alex, but ONLY save Faculty ones (IDs starting with 'f')
        const apptRes = await fetch('http://localhost:5000/api/mentoring/appointments?studentId=s101');
        const apptData = await apptRes.json();
        setBookings(apptData.filter(app => app.mentorId.startsWith('f'))); // <-- THIS IS THE FIX
      } catch (err) {
        console.error("Failed to load mentoring data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- 2. BOOKING LOGIC WITH ERROR HANDLING ---
  const handleBookSlot = async (lecturer) => {
    const bookingData = {
      mentorId: lecturer.id,
      mentorName: lecturer.name,
      studentId: 's101', // Mock ID for Alex
      studentName: 'Alex',
      topic: lecturer.tag || lecturer.expertise,
      date: '2026-03-25', // Should ideally come from a Date Picker
      time: '14:00'
    };

    try {
      const response = await fetch('http://localhost:5000/api/mentoring/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle Double-Booking (Part 2 of backend logic)
        if (response.status === 400) {
          alert(`⚠️ Slot Taken: ${data.message}`);
          return;
        }
        throw new Error(data.message);
      }

      alert(`✅ Request sent to ${lecturer.name}!`);
      
      // Refresh the list to show the new "Pending" booking
      const refreshRes = await fetch('http://localhost:5000/api/mentoring/appointments?studentId=s101');
      setBookings(await refreshRes.json());

    } catch (err) {
      alert("❌ Error: Could not connect to the server.");
    }
  };

  const expertise = [
    { title: 'Machine Learning', img: '/images-d/machine.png' }, 
    { title: 'System Architecture', img: '/images-d/system.jpg' }, 
    { title: 'User Interface Design', img: '/images-d/ui.jpg' }, 
    { title: 'Database Security', img: '/images-d/security.jpg' } 
  ];

  // Logic for Sidebar
  const pastLecturers = lecturers.slice(0, 4);
  const displayedLecturers = isExpanded ? pastLecturers : pastLecturers.slice(0, 2);

  // --- 3. SEARCH LOGIC ---
  const filteredLecturers = lecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lecturer.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSmartBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  if (loading) return <div className="loading-spinner">Loading Faculty...</div>;

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">
        <button onClick={handleSmartBack} className="back-navigation-btn">
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Faculty` : "Book a Lecturer"}</h2>
        
        {selectedCategory ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Filter lecturers by selected category expertise */}
            {lecturers.filter(l => l.expertise === selectedCategory).map((lecturer, idx) => (
              <div key={idx} className="booking-item-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div className="avatar-circle">
                      <Icon icon="lucide:user" width="30" />
                  </div>
                  <div className="mentor-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0 }}>{lecturer.name}</h4>
                        <span className="tag-pill-purple">{lecturer.tag}</span>
                      </div>
                      {/* New Bio and Email sections */}
                      <p className="mentor-bio">{lecturer.bio}</p>
                      <a href={`mailto:${lecturer.email}`} className="mentor-contact">
                        <Icon icon="lucide:mail" width="16" /> {lecturer.email}
                      </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => handleBookSlot(lecturer)} 
                    className="book-btn-main"
                  >
                      <Icon icon="lucide:calendar-plus" width="18" /> Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="search-container">
              <Icon icon="lucide:search" width="20" />
              <input 
                type="text" 
                placeholder="Search by name or subject..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Expertise Grid */}
            <div className="expertise-row">
              {expertise.map((item, idx) => (
                <div key={idx} className="lecturer-card" onClick={() => setSelectedCategory(item.title)}>
                  <span className="expertise-pill">{item.title}</span>
                  <img src={item.img} alt={item.title} />
                </div>
              ))}
            </div>

            {/* My Appointments (Drawn from Backend) */}
            <div className="bookings-list">
              <h3>{lecturers ? "My Faculty Appointments" : "Your Peer Sessions"}</h3>
  
              {bookings.length > 0 ? (
                bookings.map((booking, idx) => (
                  <div key={idx} className="booking-item">
                    {/* Left Section: Mentor & Topic */}
                    <div className="lecturer-meta">
                      <p className="lecturer-name">{booking.mentorName}</p>
                      <span className="tag-pill">{booking.topic}</span>
                    </div>

                    {/* Center Section: Status & Date */}
                    <div className="status-info">
                      {/* status.toLowerCase() triggers the CSS colors (accepted, pending, etc.) */}
                      <p className={`status-text ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </p>
                      <small>{booking.date} at {booking.time}</small>
                    </div>

                    {/* Right Section: Action Button */}
                    {booking.status === 'Accepted' ? (
                      <button 
                        className="join-btn" 
                        onClick={() => window.open(booking.link, '_blank')}
                      >
                        Join Session
                      </button>
                    ) : (
                      <div style={{ width: '120px' }}></div> /* Spacer to keep alignment neat */
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data-text">No upcoming sessions found.</p>
              )}
            </div>
          </>
        )}
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3>Your Calendar</h3>
          <MiniCalendar bookedDates={bookings.map(b => new Date(b.date))} />
        </div>
      </aside>
    </div>
  );
};

export default LecturerMentoring;