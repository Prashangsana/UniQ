import React, { useState, useEffect } from 'react'; // Added useEffect
import { Icon } from '@iconify/react';
import './Mentoring.css';
import MiniCalendar from '../components/MiniCalendar';

const PeerMentoring = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- 1. DYNAMIC STATE FOR BACKEND DATA ---
  const [bookings, setBookings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. FETCH PEER MENTORS & APPOINTMENTS ---
  useEffect(() => {
    const fetchPeerData = async () => {
      try {
        setLoading(true);
        // Fetch ALL Mentors, but ONLY save the Peer ones
        const mentorRes = await fetch('http://localhost:5000/api/mentoring/mentors');
        const mentorData = await mentorRes.json();
        setMentors(mentorData.filter(m => m.role === 'peer-mentor')); // <-- THIS IS THE FIX

        // Fetch ALL Appointments for Alex, but ONLY save Peer ones (IDs starting with 'p')
        const apptRes = await fetch('http://localhost:5000/api/mentoring/appointments?studentId=s101');
        const apptData = await apptRes.json();
        setBookings(apptData.filter(app => app.mentorId.startsWith('p'))); // <-- THIS IS THE FIX
      } catch (err) {
        console.error("Failed to load peer mentoring data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeerData();
  }, []);

  // --- 3. BOOKING LOGIC WITH 400 ERROR HANDLING ---
  const handleBookSlot = async (mentor) => {
    const bookingData = {
      mentorId: mentor.id,
      mentorName: mentor.name,
      studentId: 's101', // Alex
      studentName: 'Alex',
      topic: mentor.tag || mentor.expertise,
      date: '2026-03-28', // Placeholder Date
      time: '10:00 AM'
    };

    try {
      const response = await fetch('http://localhost:5000/api/mentoring/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Double-Booking Prevention Logic
        if (response.status === 400) {
          alert(`⚠️ Slot Taken: ${data.message}`);
          return;
        }
        throw new Error(data.message);
      }

      alert(`✅ Request sent to ${mentor.name}!`);
      
      // Refresh the list immediately
      const refreshRes = await fetch('http://localhost:5000/api/mentoring/appointments?studentId=s101');
      setBookings(await refreshRes.json());

    } catch (err) {
      alert("❌ Error: Could not process booking.");
    }
  };

  const expertise = [
    { title: 'Study Tips', img: '/images-d/study.jpg' }, 
    { title: 'Project Help', img: '/images-d/project.png' }, 
    { title: 'Exam Prep', img: '/images-d/exam.jpg' }, 
    { title: 'Coding Help', img: '/images-d/code.png' }  
  ];

  // Logic for Sidebar
  const pastMentorsList = mentors.slice(0, 4);
  const displayedMentors = isExpanded ? pastMentorsList : pastMentorsList.slice(0, 2);

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mentor.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSmartBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  if (loading) return <div className="loading-spinner">Loading Peer Mentors...</div>;

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">

        <button onClick={handleSmartBack} className="back-navigation-btn">
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Mentors` : "Find a Peer Mentor"}</h2>
        
        {selectedCategory ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Filter dynamic mentors by category */}
            {mentors.filter(m => m.expertise === selectedCategory).map((mentor, idx) => (
              <div key={idx} className="booking-item-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div className="avatar-circle">
                      <Icon icon="lucide:user" width="30" />
                  </div>
                  <div className="mentor-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4 style={{ margin: 0 }}>{mentor.name}</h4>
                        <span className="tag-pill-purple">{mentor.tag}</span>
                      </div>
                      {/* New Bio and Email sections */}
                      <p className="mentor-bio">{mentor.bio}</p>
                      <a href={`mailto:${mentor.email}`} className="mentor-contact">
                        <Icon icon="lucide:mail" width="16" /> {mentor.email}
                      </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => handleBookSlot(mentor)} className="book-btn-main">
                      <Icon icon="lucide:calendar-plus" width="18" /> Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="search-container">
              <Icon icon="lucide:search" width="20" />
              <input 
                type="text"
                placeholder="Search by name or tag..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {searchTerm !== '' ? (
              <div className="search-results">
                <h3>Search Results</h3>
                {filteredMentors.map((mentor, idx) => (
                  <div key={idx} className="booking-item">
                    <div className="lecturer-meta">
                      <p className="lecturer-name">{mentor.name}</p>
                      <span className="tag-pill">{mentor.tag}</span>
                    </div>
                    <button onClick={() => handleBookSlot(mentor)} className="calendar-link">Book Session</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="expertise-row">
                {expertise.map((item, idx) => (
                  <div key={idx} className="lecturer-card" onClick={() => setSelectedCategory(item.title)}>
                    <span className="expertise-pill">{item.title}</span>
                    <img src={item.img} alt={item.title} />
                  </div>
                ))}
              </div>
            )}

            <div className="bookings-list">
              <h3>Your Peer Sessions</h3>
              {bookings.map((booking, idx) => (
                <div key={idx} className="booking-item">
                  <div className="lecturer-meta">
                    <p className="lecturer-name">{booking.mentorName}</p>
                    <span className="tag-pill">{booking.topic}</span>
                  </div>
                  <div className="status-info">
                    <p className={`status-text ${booking.status.toLowerCase()}`}>{booking.status}</p>
                    <small>{booking.date}</small>
                  </div>
                  {booking.status === 'Accepted' && (
                    <button className="join-btn" onClick={() => window.open(booking.link, '_blank')}> 
                       Join Session
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3>Calendar</h3>
          <MiniCalendar bookedDates={bookings.map(b => new Date(b.date))} />
        </div>
      </aside>
    </div>
  );
};

export default PeerMentoring;