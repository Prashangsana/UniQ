import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import './Mentoring.css';
import MiniCalendar from '../components/MiniCalendar';

// FIX 1: use environment variable instead of hardcoded localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PeerMentoring = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX 7: booking modal state
  const [bookingMentor, setBookingMentor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const currentUserId = localStorage.getItem('user_id');
  const currentUserName = localStorage.getItem('user_name') || 'User';

  useEffect(() => {
    const fetchPeerData = async () => {
      try {
        setLoading(true);
        // FIX 2: added credentials: 'include' so the session cookie is sent
        const mentorRes = await fetch(`${API_URL}/api/mentoring/mentors?role=peer-mentor`, {
          credentials: 'include'
        });
        const mentorData = await mentorRes.json();
        setMentors(mentorData);

        const apptRes = await fetch(`${API_URL}/api/mentoring/appointments?studentId=${currentUserId}`, {
          credentials: 'include'
        });
        const apptData = await apptRes.json();
        setBookings(apptData);
      } catch (err) {
        console.error("Failed to load peer mentoring data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeerData();
  }, [currentUserId]);

  // FIX 7: actually POST a booking to the backend instead of just opening Google Calendar
  const handleBookSlot = (mentor) => {
    setBookingMentor(mentor);
    setBookingTopic(Array.isArray(mentor.expertise) ? mentor.expertise[0] : mentor.expertise || '');
    setBookingDate('');
    setBookingTime('');
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate || !bookingTime || !bookingTopic) {
      alert('Please fill in all fields.');
      return;
    }
    try {
      setBookingLoading(true);
      const res = await fetch(`${API_URL}/api/mentoring/book`, {
        method: 'POST',
        credentials: 'include',                           // FIX 2
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: bookingMentor._id,
          studentId: currentUserId,
          studentName: currentUserName,
          topic: bookingTopic,
          date: bookingDate,
          time: bookingTime
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Booking failed.');
        return;
      }
      setBookings(prev => [...prev, data]);
      setBookingMentor(null);
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  // FIX 3: convert both sides to string before comparing — mentorId is an ObjectId in the DB
  const isAlreadyBooked = (mentorId) => {
    return bookings.some(
      b => b.mentorId?.toString() === mentorId?.toString() &&
           (b.status === 'Pending' || b.status === 'Accepted')
    );
  };

  const expertise = [
    { title: 'Study Tips', img: '/images-d/study.jpg' },
    { title: 'Project Help', img: '/images-d/project.png' },
    { title: 'Exam Prep', img: '/images-d/exam.jpg' },
    { title: 'Coding Help', img: '/images-d/code.png' }
  ];

  const pastMentorsList = mentors.slice(0, 4);
  const displayedMentors = isExpanded ? pastMentorsList : pastMentorsList.slice(0, 2);

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(mentor.expertise)
      ? mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
      : mentor.expertise?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSmartBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (searchTerm) {
      setSearchTerm('');
    } else {
      onBack();
    }
  };

  const mentorListToShow = selectedCategory
    ? mentors.filter(m => Array.isArray(m.expertise) ? m.expertise.includes(selectedCategory) : m.expertise === selectedCategory)
    : filteredMentors;

  if (loading) return <div className="loading-spinner">Loading Peer Mentors...</div>;

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">

        <button onClick={handleSmartBack} className="back-navigation-btn">
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory || searchTerm ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Mentors` : searchTerm ? "Search Results" : "Find a Peer Mentor"}</h2>

        {selectedCategory || searchTerm ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {mentorListToShow.map((mentor) => (
              <div key={mentor._id} className="booking-item-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div className="avatar-circle">
                    <Icon icon="lucide:user" width="30" />
                  </div>
                  <div className="mentor-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ margin: 0 }}>{mentor.name}</h4>
                      <span className="tag-pill-purple">{Array.isArray(mentor.expertise) ? mentor.expertise[0] : mentor.expertise}</span>
                    </div>
                    <p className="mentor-bio">{mentor.bio}</p>
                    <a href={`mailto:${mentor.email}`} className="mentor-contact">
                      <Icon icon="lucide:mail" width="16" /> {mentor.email}
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleViewProfile(mentor._id)}
                    className="view-profile-btn"
                    style={{ background: '#f0f2f5', color: '#1a2b4b', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Icon icon="lucide:user" width="18" /> View Profile
                  </button>
                  <button
                    onClick={() => handleBookSlot(mentor)}
                    className="book-btn-main"
                    disabled={isAlreadyBooked(mentor._id)}
                    style={{ background: isAlreadyBooked(mentor._id) ? '#ccc' : '#1a2b4b', cursor: isAlreadyBooked(mentor._id) ? 'not-allowed' : 'pointer' }}
                  >
                    <Icon icon={isAlreadyBooked(mentor._id) ? "lucide:check-circle" : "lucide:calendar-plus"} width="18" />
                    {isAlreadyBooked(mentor._id) ? "Already Booked" : "Book Session"}
                  </button>
                </div>
              </div>
            ))}
            {mentorListToShow.length === 0 && (
              <p className="no-data-text">No mentors found matching your criteria.</p>
            )}
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

            <div className="expertise-row">
              {expertise.map((item) => (
                <div key={item.title} className="lecturer-card" onClick={() => setSelectedCategory(item.title)}>
                  <span className="expertise-pill">{item.title}</span>
                  <img src={item.img} alt={item.title} />
                </div>
              ))}
            </div>

            <div className="bookings-list">
              <h3>Your Peer Sessions</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="booking-item">
                    <div className="lecturer-meta">
                      {/* FIX 5: mentorName is now stored in the DB and returned in the response */}
                      <p className="lecturer-name">{booking.mentorName || 'Mentor'}</p>
                      <span className="tag-pill">{booking.topic}</span>
                    </div>
                    <div className="status-info">
                      <p className={`status-text ${booking.status.toLowerCase()}`}>{booking.status}</p>
                      <small>{booking.date} at {booking.time}</small>
                    </div>
                    {booking.status === 'Accepted' ? (
                      <button className="join-btn" onClick={() => window.open(booking.link, '_blank')}>
                        Join Session
                      </button>
                    ) : (
                      <div style={{ width: '120px' }}></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data-text">No upcoming peer sessions found.</p>
              )}
            </div>
          </>
        )}
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3>Recent Mentors</h3>
          <div className="past-mentors">
            {displayedMentors.map((mentor) => (
              <div key={mentor._id} className="mini-mentor-card">
                <div className="avatar-small">
                  <Icon icon="lucide:user" width="20" />
                </div>
                <div className="mini-details">
                  <p className="mini-name">{mentor.name}</p>
                  <p className="mini-tag">{Array.isArray(mentor.expertise) ? mentor.expertise[0] : mentor.expertise}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show Less' : 'View More'}
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Availability</h3>
          <MiniCalendar bookedDates={bookings.map(b => new Date(b.date))} />
        </div>
      </aside>

      {/* FIX 7: Booking modal — collects date/time/topic and POSTs to backend */}
      {bookingMentor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '35px', width: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '5px', color: '#1a2b4b' }}>Book a Session</h3>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>with {bookingMentor.name}</p>

            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Topic</label>
            <input
              type="text"
              value={bookingTopic}
              onChange={e => setBookingTopic(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Time</label>
            <input
              type="time"
              value={bookingTime}
              onChange={e => setBookingTime(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '24px', fontSize: '14px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setBookingMentor(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: '#f0f2f5', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#1a2b4b', color: '#fff', cursor: bookingLoading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerMentoring;