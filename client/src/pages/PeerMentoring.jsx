import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css';
import MiniCalendar from '../components/MiniCalendar';

const PeerMentoring = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const expertise = [
    { title: 'Study Tips', img: '/images-d/study.jpg' }, 
    { title: 'Project Help', img: '/images-d/project.png' }, 
    { title: 'Exam Prep', img: '/images-d/exam.jpg' }, 
    { title: 'Coding Help', img: '/images-d/code.png' }  
  ];

  const bookings = [
    { name: 'Alex (Senior)', tag: 'React', status: 'Accepted', date: 'Tomorrow at 4 PM', link: 'https://calendar.google.com/calendar/u/0/r/day' },
    { name: 'Sam (Junior)', tag: 'Python', status: 'Pending', date: 'Sunday at 1 PM', link: 'https://calendar.google.com/calendar/u/0/r/day'},
  ];

  const today = new Date();
  const globalBookedDates = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), 
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), 
    new Date(2025, 11, 1), 
  ];

  const availableMentors = [
    { name: 'Jordan (Senior)', tag: 'React' },
    { name: 'Casey (Junior)', tag: 'Python' },
    { name: 'Morgan (Alumni)', tag: 'Study Tips' },
    { name: 'Jamie (Senior)', tag: 'Exam Prep' },
  ];

  const categorizedPeers = {
    'Study Tips': [
      { name: 'Morgan (Alumni)', tag: 'Study Strategies', desc: 'Expert in time management and effective revision techniques.', email: 'w1827364@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Riley (Senior)', tag: 'Note-taking', desc: 'I can show you how to structure your university notes for maximum retention.', email: 'w1928374@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Sam (Junior)', tag: 'Focus Habits', desc: 'Struggling with procrastination? Let\'s work on Pomodoro techniques.', email: 'w1738294@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' }
    ],
    'Project Help': [
      { name: 'Alex (Senior)', tag: 'React & Node.js', desc: 'Full-stack developer ready to help you debug your coursework.', email: 'w1647382@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Jordan (Senior)', tag: 'System Design', desc: 'Let me help you draw UML diagrams and plan your database.', email: 'w1847263@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Taylor (Alumni)', tag: 'Agile/Scrum', desc: 'Need help managing your group project? I can teach you Jira and Trello.', email: 'w1536273@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' }
    ],
    'Exam Prep': [
      { name: 'Casey (Junior)', tag: 'Past Papers', desc: 'I have compiled strategies for tackling CS past papers.', email: 'w1938472@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Jamie (Senior)', tag: 'Mock Exams', desc: 'I offer 1-on-1 mock exam sessions for core modules.', email: 'w1827365@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' }
    ],
    'Coding Help': [
      { name: 'Chris (Senior)', tag: 'Python & AI', desc: 'Stuck on a Python assignment? Let\'s fix those loops and functions.', email: 'w1837465@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Avery (Junior)', tag: 'Java & OOP', desc: 'I can simplify polymorphism, inheritance, and encapsulation.', email: 'w1948576@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' },
      { name: 'Taylor (Senior)', tag: 'C++ & Algorithms', desc: 'Master memory management and complex data structures.', email: 'w1736485@my.westminster.ac.uk', link: 'https://calendar.google.com/calendar/u/0/r/day' }
    ]
  };

  const pastMentors = [
    { name: 'Taylor', tag: 'JavaScript' },
    { name: 'Chris', tag: 'UI/UX' },
    { name: 'Avery', tag: 'Data Structures' },
    { name: 'Riley', tag: 'Machine Learning' }
  ];

  const filteredMentors = availableMentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mentor.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedMentors = isExpanded ? pastMentors : pastMentors.slice(0, 2);

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

        <button onClick={handleSmartBack} className="back-navigation-btn">
          <Icon icon="lucide:arrow-left" width="20" /> {selectedCategory ? "Back to Search" : "Back to Hub"}
        </button>

        <h2>{selectedCategory ? `${selectedCategory} Mentors` : "Find a Peer Mentor"}</h2>
        <p style={{ color: 'var(--body-text-gray)', marginBottom: '20px' }}>
          {selectedCategory ? `Top students specializing in ${selectedCategory.toLowerCase()}.` : "Connect with fellow students for guidance."}
        </p>
        
        {selectedCategory ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {categorizedPeers[selectedCategory]?.map((mentor, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   {/* User Icon Placeholder */}
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon icon="lucide:user" width="30" style={{ color: '#888' }} />
                   </div>
                   <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-navy)' }}>{mentor.name}</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: '600' }}>{mentor.tag}</span>
                        <span style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icon icon="lucide:mail" width="12" /> {mentor.email}
                        </span>
                      </div>
                   </div>
                </div>
                <p style={{ color: '#555', fontSize: '0.95rem', margin: 0, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                   {mentor.desc}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                   <button onClick={() => window.open(mentor.link, '_blank')} style={{ flex: 1, background: 'var(--deep-navy)', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
                      <Icon icon="lucide:calendar-plus" width="18" /> Book Slot
                   </button>
                   <a href={`mailto:${mentor.email}`} style={{ flex: 1, background: '#f0f4f8', color: 'var(--deep-navy)', border: '1px solid var(--deep-navy)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', boxSizing: 'border-box' }}>
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
                placeholder="Search by name or tag..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '15px' }}
              />
            </div>

            {searchTerm !== '' ? (
              <div className="search-results">
                <h3 style={{ marginBottom: '15px' }}>Search Results</h3>
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor, idx) => (
                    <div key={idx} className="booking-item" style={{ background: '#fff', border: '1px solid #eee' }}>
                      <div className="lecturer-meta">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' }}>
                          <Icon icon="lucide:user" width="20" style={{ color: '#888' }} />
                        </div>
                        <div className="lecturer-details">
                          <p className="lecturer-name">{mentor.name}</p>
                          <span className="tag-pill">{mentor.tag}</span>
                        </div>
                      </div>
                      <button className="calendar-link" style={{ background: 'var(--deep-navy)', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>Book Session</button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666' }}>No mentors found matching "{searchTerm}".</p>
                )}
              </div>
            ) : (
              <div className="expertise-row">
                {expertise.map((item, idx) => (
                  <div key={idx} className="lecturer-card" onClick={() => setSelectedCategory(item.title)} style={{ cursor: 'pointer' }}>
                    <span className="expertise-pill">{item.title}</span>
                    <div className="avatar-placeholder">
                       <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src="/logo.png" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bookings-list" style={{ marginTop: '30px' }}>
              <h3>Your Peer Sessions</h3>
              {bookings.map((booking, idx) => (
                <div key={idx} className="booking-item">
                  <div className="lecturer-meta">
                    <div className="mini-avatar" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Icon icon="lucide:user" width="14" style={{ color: '#888' }} />
                    </div>
                    <div className="lecturer-details">
                      <p className="lecturer-name">{booking.name}</p>
                      <span className="tag-pill">{booking.tag}</span>
                    </div>
                  </div>
                  <div className="status-info">
                    <p className="status-text">{booking.status}</p>
                    <small className="date-text">{booking.date}</small>
                  </div>
                  <button className="btn-view-calendar" onClick={() => window.open(booking.link, '_blank')}> 
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
          <h3 onClick={() => setIsExpanded(!isExpanded)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            Your Peer Mentors 
            <Icon icon={isExpanded ? "lucide:chevron-up" : "lucide:chevron-down"} width="20" style={{ color: '#999' }} />
          </h3>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {displayedMentors.map((mentor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon icon="lucide:user" width="24" style={{ color: '#888' }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'var(--deep-navy)' }}>{mentor.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{mentor.tag}</p>
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

export default PeerMentoring;