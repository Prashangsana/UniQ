import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import './Mentoring.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SessionCalendar = ({ allSessions, onDayClick, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookedSet = new Set(allSessions.map(s => s.date).filter(Boolean));
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const makeDateStr = (d) => `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
        <button onClick={() => setViewDate(new Date(year, month-1, 1))} style={navBtnStyle}>
          <Icon icon="lucide:chevron-left" width="16" />
        </button>
        <span style={{ fontWeight:700, fontSize:'15px', color:'var(--deep-navy)' }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={() => setViewDate(new Date(year, month+1, 1))} style={navBtnStyle}>
          <Icon icon="lucide:chevron-right" width="16" />
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'6px' }}>
        {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'11px', fontWeight:700, color:'#aaa', padding:'4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'3px' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dateStr = makeDateStr(d);
          const isBooked = bookedSet.has(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(isSelected ? null : dateStr)}
              style={{
                position:'relative', aspectRatio:'1', border:'none', borderRadius:'10px',
                background: isSelected ? 'var(--deep-navy)' : isToday ? '#eef2ff' : 'transparent',
                color: isSelected ? '#fff' : isToday ? '#4f46e5' : '#333',
                fontWeight: isBooked || isToday ? 700 : 400, fontSize:'13px',
                cursor: isBooked ? 'pointer' : 'default', transition:'all 0.15s ease',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px',
              }}
            >
              {d}
              {isBooked && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: isSelected ? '#a5b4fc' : '#0d214f', display:'block' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const navBtnStyle = {
  background:'#f4f5f7', border:'none', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center', color:'#555', transition:'background 0.15s'
};

const LecturerMentoring = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const daySessionsToShow = selectedDate ? bookings.filter(b => b.date === selectedDate) : [];

  const [bookingLecturer, setBookingLecturer] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const currentUserId = localStorage.getItem('user_id');
  const currentUserName = localStorage.getItem('user_name') || 'User';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const mentorRes = await fetch(`${API_URL}/api/mentoring/mentors?role=faculty`, {
          credentials: 'include'
        });
        const mentorData = await mentorRes.json();
        setLecturers(mentorData);

        const apptRes = await fetch(`${API_URL}/api/mentoring/appointments?studentId=${currentUserId}`, {
          credentials: 'include'
        });
        const apptData = await apptRes.json();
        const lecturerAppts = apptData.filter(appt => 
          mentorData.some(mentor => String(mentor._id) === String(appt.mentorId))
        );
        setBookings(lecturerAppts);
      } catch (err) {
        console.error("Failed to load mentoring data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [currentUserId]);

  const handleBookSlot = (lecturer) => {
    setBookingLecturer(lecturer);
    setBookingTopic(Array.isArray(lecturer.expertise) ? lecturer.expertise[0] : lecturer.expertise || '');
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
          mentorId: bookingLecturer._id,
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
      setBookingLecturer(null);
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const isAlreadyBooked = (mentorId) => {
    return bookings.some(
      b => b.mentorId?.toString() === mentorId?.toString() &&
           (b.status === 'Pending' || b.status === 'Accepted')
    );
  };

  const expertise = [
    { title: 'Machine Learning', img: '/images-d/machine.png' },
    { title: 'System Architecture', img: '/images-d/system.jpg' },
    { title: 'User Interface Design', img: '/images-d/ui.jpg' },
    { title: 'Database Security', img: '/images-d/security.jpg' }
  ];

  const pastLecturers = lecturers.slice(0, 4);
  const displayedLecturers = isExpanded ? pastLecturers : pastLecturers.slice(0, 2);

const filteredLecturers = lecturers.filter(lecturer => {
    const term = searchTerm?.toLowerCase().trim();
    if (!term) return true; 

    const nameMatch = lecturer.name && String(lecturer.name).toLowerCase().includes(term);

    let expMatch = false;
    if (Array.isArray(lecturer.expertise)) {
      expMatch = lecturer.expertise.some(e => e && String(e).toLowerCase().includes(term));
    } else if (lecturer.expertise) {
      expMatch = String(lecturer.expertise).toLowerCase().includes(term);
    }

    return nameMatch || expMatch;
  });

  const handleSmartBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (searchTerm) {
      setSearchTerm('');
    } else {
      onBack();
    }
  };

  const lecturerListToShow = selectedCategory
    ? lecturers.filter(l => {
        if (Array.isArray(l.expertise)) return l.expertise.includes(selectedCategory);
        return l.expertise === selectedCategory;
      })
    : filteredLecturers;

  if (loading) return <div className="loading-spinner">Loading Faculty...</div>;

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">
        <button onClick={handleSmartBack} className="back-navigation-btn">
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory || searchTerm ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Faculty` : searchTerm ? "Search Results" : "Book a Lecturer"}</h2>

        {selectedCategory || searchTerm ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {lecturerListToShow.map((lecturer) => (
              <div key={lecturer._id} className="booking-item-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div className="avatar-circle">
                    <Icon icon="lucide:user" width="30" />
                  </div>
                  <div className="mentor-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ margin: 0 }}>{lecturer.name}</h4>
                      <span className="tag-pill-purple">{Array.isArray(lecturer.expertise) ? lecturer.expertise[0] : lecturer.expertise}</span>
                    </div>
                    <p className="mentor-bio">{lecturer.bio}</p>
                    <a href={`mailto:${lecturer.email}`} className="mentor-contact">
                      <Icon icon="lucide:mail" width="16" /> {lecturer.email}
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleViewProfile(lecturer._id)}
                    className="view-profile-btn"
                    style={{ background: '#f0f2f5', color: '#1a2b4b', border: 'none', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Icon icon="lucide:user" width="18" /> View Profile
                  </button>
                  <button
                    onClick={() => handleBookSlot(lecturer)}
                    className="book-btn-main"
                    disabled={isAlreadyBooked(lecturer._id)}
                    style={{ background: isAlreadyBooked(lecturer._id) ? '#ccc' : '#1a2b4b', cursor: isAlreadyBooked(lecturer._id) ? 'not-allowed' : 'pointer' }}
                  >
                    <Icon icon={isAlreadyBooked(lecturer._id) ? "lucide:check-circle" : "lucide:calendar-plus"} width="18" />
                    {isAlreadyBooked(lecturer._id) ? "Already Booked" : "Book Session"}
                  </button>
                </div>
              </div>
            ))}
            {lecturerListToShow.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #cbd5e1', gridColumn: '1 / -1' }}>
                <Icon icon="lucide:search-x" width="48" style={{ color: '#94a3b8', marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--deep-navy)', fontSize: '1.2rem' }}>No Matches Found</h3>
                <p style={{ margin: 0, color: '#64748b' }}>We couldn't find any faculty matching "{searchTerm || selectedCategory}". Try a different keyword.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="search-container">
              <Icon icon="lucide:search" width="20" />
              <input
                type="text"
                placeholder="Search by name or subject..."
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
              <h3>My Faculty Appointments</h3>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking._id} className="booking-item">
                    <div className="lecturer-meta">
                      {/* FIX 5: mentorName is now stored in the DB */}
                      <p className="lecturer-name">{booking.mentorName || 'Lecturer'}</p>
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
                <p className="no-data-text">No upcoming sessions found.</p>
              )}
            </div>
          </>
        )}
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'18px' }}>
            <Icon icon="lucide:calendar-days" width="18" style={{ color:'var(--deep-navy)' }} />
            <h3 style={{ margin:0, fontSize:'14px', fontWeight:800, color:'var(--deep-navy)' }}>Your Booked Dates</h3>
          </div>

          <SessionCalendar
            allSessions={bookings}
            onDayClick={setSelectedDate}
            selectedDate={selectedDate}
          />

          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'16px', paddingTop:'14px', borderTop:'1px solid #f0f0f0' }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#0d214f', display:'inline-block' }} />
            <span style={{ fontSize:'11px', color:'#999', fontWeight:600 }}>= session booked</span>
          </div>

          {/* Day Detail Panel */}
          {selectedDate && (
            <div style={{ marginTop:'16px', borderTop:'1px solid #f0f0f0', paddingTop:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
                <span style={{ fontSize:'13px', fontWeight:800, color:'var(--deep-navy)' }}>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' })}
                </span>
                <button onClick={() => setSelectedDate(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', padding:'2px' }}>
                  <Icon icon="lucide:x" width="14" />
                </button>
              </div>

              {daySessionsToShow.length === 0 ? (
                <p style={{ fontSize:'12px', color:'#bbb', textAlign:'center', padding:'10px 0' }}>No sessions booked on this day.</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {daySessionsToShow.map(s => (
                    <div key={s._id} style={{ background:'#f9fafb', borderRadius:'10px', padding:'10px 12px', borderLeft:'3px solid var(--deep-navy)' }}>
                      <div style={{ fontSize:'12px', fontWeight:700, color:'var(--deep-navy)' }}>{s.mentorName || 'Mentor'}</div>
                      <div style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>{s.topic}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'6px', flexWrap:'wrap' }}>
                        <Icon icon="lucide:clock" width="11" style={{ color:'#0d214f' }} />
                        <span style={{ fontSize:'11px', color:'#0d214f', fontWeight:700 }}>{s.time}</span>
                        <span style={{ fontSize:'10px', padding:'2px 6px', background:'#eee', borderRadius:'10px', marginLeft:'auto', fontWeight:600 }}>{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {bookingLecturer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '35px', width: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '5px', color: '#1a2b4b' }}>Book a Consultation</h3>
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>with {bookingLecturer.name}</p>

            <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>Topic / Reason</label>
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
                onClick={() => setBookingLecturer(null)}
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

export default LecturerMentoring;