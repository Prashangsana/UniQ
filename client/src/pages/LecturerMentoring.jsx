import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css'; 
import MiniCalendar from '../components/MiniCalendar';

const LecturerMentoring = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const expertise = [
    { title: 'Machine Learning', img: '/images-d/machine.png' }, 
    { title: 'System Architecture', img: '/images-d/system.jpg' }, 
    { title: 'User Interface Design', img: '/images-d/ui.jpg' }, 
    { title: 'Database Security', img: '/images-d/security.jpg' } 
  ];

  const bookings = [
    { name: 'Dr. Nilaskshi', tag: 'ML', status: '1 day to go', date: '1st December 2025', link: 'https://calendar.google.com/calendar/u/0/r/day' },
    { name: 'Prof. Sankeetha', tag: 'OOP', status: 'Requested', date: '2nd January 2026', link: 'https://calendar.google.com/calendar/u/0/r/day'},
    { name: 'Dr. Suresh', tag: 'Backend', status: 'Accepted', date: '3rd February 2026', link: 'https://calendar.google.com/calendar/u/0/r/day' },
  ];

  const today = new Date();
  const globalBookedDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), 
    new Date(2025, 11, 1), 
  ];

  const availableLecturers = [
    { name: 'Dr. Smith', tag: 'Machine Learning', img: '/images-d/ml.jpg' },
    { name: 'Prof. Johnson', tag: 'System Architecture', img: '/images-d/gd.jpg' },
    { name: 'Dr. Lee', tag: 'UI/UX Design', img: '/images-d/design.jpg' },
    { name: 'Prof. Davis', tag: 'Database Security', img: '/images-d/gp.jpg' },
  ];

  const categorizedLecturers = {
    'Machine Learning': [
      { name: 'Dr. Nilaskshi', tag: 'Neural Networks', desc: 'Consult with me regarding your final year projects involving deep learning, NLP, or computer vision.', email: 'n.nilaskshi@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/ml.jpg' },
      { name: 'Dr. Smith', tag: 'Data Science', desc: 'Available for discussions on data mining, predictive analytics, and statistical modeling approaches.', email: 'j.smith@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/ml.jpg' },
      { name: 'Prof. Sarah', tag: 'AI Ethics', desc: 'Book a session to discuss the ethical implications of your AI models and bias mitigation strategies.', email: 's.jones@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/ai.png' }
    ],
    'System Architecture': [
      { name: 'Prof. Johnson', tag: 'Cloud Computing', desc: 'Expert in AWS and Azure. I can help you design scalable, highly available architectures for your applications.', email: 'r.johnson@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/gd.jpg' },
      { name: 'Dr. Alan', tag: 'Distributed Systems', desc: 'Schedule a meeting to review your microservices architecture and load balancing strategies.', email: 'a.turing@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/robotics.jpg' }
    ],
    'UI/UX Design': [
      { name: 'Dr. Lee', tag: 'HCI', desc: 'Specializing in Human-Computer Interaction. I can review your wireframes, prototypes, and user testing plans.', email: 'k.lee@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/design.jpg' },
      { name: 'Prof. Davis', tag: 'Accessibility', desc: 'Ensure your applications meet WCAG standards. Let\'s evaluate your interface for inclusive design.', email: 'm.davis@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/gp.jpg' }
    ],
    'Database Security': [
      { name: 'Prof. Mark', tag: 'Cybersecurity', desc: 'Discuss penetration testing, vulnerability assessments, and secure database configurations.', email: 'm.cuban@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/gp.jpg' },
      { name: 'Dr. Emily', tag: 'Cryptography', desc: 'Available to guide you through encryption protocols, secure data storage, and network security concepts.', email: 'e.clark@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/design.jpg' },
      { name: 'Dr. Suresh', tag: 'Backend Auth', desc: 'Need help securing your API? We can review your JWT, OAuth implementations, and server-side validation.', email: 's.suresh@westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day', img: '/images-d/gd.jpg' }
    ]
  };

  // CHANGED: Set images to null to trigger the icon component!
  const pastLecturers = [
    { name: 'Dr. Alan', tag: 'Algorithms', img: null },
    { name: 'Prof. Sarah', tag: 'Data Science', img: null },
    { name: 'Dr. Emily', tag: 'Software Engineering', img: null },
    { name: 'Prof. Mark', tag: 'Cybersecurity', img: null }
  ];

  const filteredLecturers = availableLecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lecturer.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedLecturers = isExpanded ? pastLecturers : pastLecturers.slice(0, 2);

  const handleSmartBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="mentoring-layout">
      <main className="mentoring-main">

        <button 
          onClick={handleSmartBack} 
          className="back-navigation-btn"
        >
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Faculty` : "Book a Lecturer"}</h2>
        <p style={{ color: 'var(--body-text-gray)', marginBottom: '20px' }}>
          {selectedCategory ? `Faculty members available for ${selectedCategory.toLowerCase()} consultations.` : "Schedule academic consultations with faculty."}
        </p>

        {selectedCategory ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {categorizedLecturers[selectedCategory]?.map((lecturer, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <img src={lecturer.img} alt={lecturer.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', background: '#f0f2f5' }} onError={(e) => { e.target.onerror = null; e.target.src="/logo.png" }} />
                   <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-navy)' }}>{lecturer.name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: '600' }}>{lecturer.tag}</span>
                        <span style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icon icon="lucide:mail" width="12" /> {lecturer.email}
                        </span>
                      </div>
                   </div>
                </div>
                <p style={{ color: '#555', fontSize: '0.95rem', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                   {lecturer.desc}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                   <button onClick={() => window.open(lecturer.link, '_blank')} style={{ flex: 1, background: 'var(--deep-navy)', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
                      <Icon icon="lucide:calendar-plus" width="18" /> Book Slot
                   </button>
                   <a href={`mailto:${lecturer.email}`} style={{ flex: 1, background: '#f0f4f8', color: 'var(--deep-navy)', border: '1px solid var(--deep-navy)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box' }}>
                      <Icon icon="lucide:mail" width="18" /> Connect
                   </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', padding: '12px 20px', borderRadius: '12px', marginBottom: '25px' }}>
              <Icon icon="lucide:search" width="20" style={{ color: '#666', marginRight: '10px' }} />
              <input 
                type="text" 
                className='mentoring-search-input'
                placeholder="Search by name or subject (e.g. 'Machine Learning', 'Dr. Smith')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px' }}
              />
            </div>

            {searchTerm !== '' ? (
              <div className="search-results">
                <h3 style={{ marginBottom: '15px' }}>Search Results</h3>
                {filteredLecturers.length > 0 ? (
                  filteredLecturers.map((lecturer, idx) => (
                    <div key={idx} className="booking-item" style={{ background: '#fff', border: '1px solid #eee' }}>
                      <div className="lecturer-meta">
                        <div className="avatar-placeholder" style={{ width: '40px', height: '40px', marginRight: '15px' }}>
                          <img src={lecturer.img} alt={lecturer.name} onError={(e) => { e.target.onerror = null; e.target.src="/logo.png" }} />
                        </div>
                        <div className="lecturer-details">
                          <p className="lecturer-name">{lecturer.name}</p>
                          <span className="tag-pill">{lecturer.tag}</span>
                        </div>
                      </div>
                      <button className="calendar-link" style={{ background: 'var(--deep-navy)', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>Request Booking</button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No lecturers found matching "{searchTerm}".</p>
                )}
              </div>
            ) : (
              <div className="expertise-row">
                {expertise.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="lecturer-card"
                    onClick={() => setSelectedCategory(item.title)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <span className="expertise-pill">{item.title}</span>
                    <div className="avatar-placeholder">
                       <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src="/logo.png" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bookings-list" style={{ marginTop: '30px' }}>
              <h3>Faculty Appointments</h3>
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
                  <button 
                    className="btn-view-calendar" 
                    onClick={() => window.open(booking.link, '_blank', 'noopener,noreferrer')}
                  > 
                    <Icon icon="lucide:calendar-days" width="16" /> View Calendar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <aside className="mentoring-sidebar">
        <div className="sidebar-section">
          <h3 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--deep-banner-blue)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--heading-color)'}
          >
            Your Lecturers 
            <Icon icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} width="20" style={{ color: '#999' }} />
          </h3>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {displayedLecturers.map((lecturer, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                
                {/* CHANGED: Dynamically render an image OR a profile icon */}
                {lecturer.img ? (
                  <img src={lecturer.img} alt={lecturer.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: '#eee' }} onError={(e) => { e.target.onerror = null; e.target.src="/logo.png" }} />
                ) : (
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon icon="lucide:user" width="24" style={{ color: '#888' }} />
                  </div>
                )}

                <div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'var(--deep-navy)' }}>{lecturer.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{lecturer.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="sidebar-divider" style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        <div className="sidebar-section">
          <h3>Calendar</h3>
          <div style={{ marginTop: '15px' }}>
             <MiniCalendar bookedDates={globalBookedDates} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LecturerMentoring;