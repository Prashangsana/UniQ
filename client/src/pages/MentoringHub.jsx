import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import './Mentoring.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MentoringHub = ({ onSelectCategory }) => {
  const userRole = localStorage.getItem('user_role');
  const [isPeerMentor, setIsPeerMentor] = useState(
    localStorage.getItem('is_peer_mentor') === 'true'
  );
  const [registering, setRegistering] = useState(false);

  const handleRegisterAsPeerMentor = async () => {
    setRegistering(true);
    try {
      const res = await fetch(`${API_URL}/api/mentoring/register-peer`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update localStorage and notify all listeners (e.g. Home.jsx sidebar)
        localStorage.setItem('is_peer_mentor', 'true');
        window.dispatchEvent(new Event('storage'));
        setIsPeerMentor(true);
        alert('You are now registered as a Peer Mentor! Check the Sessions tab in your sidebar.');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const cardStyle = {
    background: '#fff', border: '2px solid #e5e7eb', borderRadius: '20px',
    padding: '40px 25px', cursor: 'pointer', flex: '1 1 0px',
    minWidth: '260px', maxWidth: '320px',
    transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
  };

  return (
    <div className="mentoring-layout" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <main className="mentoring-main" style={{ textAlign: 'center', maxWidth: '1100px', flex: 'none', background: 'transparent', boxShadow: 'none' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--deep-banner-blue)', marginBottom: '15px' }}>Mentoring Hub</h2>
        <p style={{ color: 'var(--body-text-gray)', fontSize: '1.1rem', marginBottom: '50px' }}>
          Who would you like to connect with today?
        </p>

        <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>

          {/* --- Find a Peer Mentor --- */}
          <div
            onClick={() => onSelectCategory('peer-mentoring')}
            style={cardStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--deep-banner-blue)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ background: '#f0f4f8', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
              <Icon icon="lucide:users" width="40" style={{ color: 'var(--deep-banner-blue)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--heading-color)' }}>Peer Mentors</h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Connect with experienced senior students for study tips, project help, and exam prep.
            </p>
          </div>

          {/* --- Find a Lecturer --- */}
          <div
            onClick={() => onSelectCategory('lecturer-mentoring')}
            style={cardStyle}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--deep-banner-blue)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ background: '#f0f4f8', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
              <Icon icon="lucide:graduation-cap" width="40" style={{ color: 'var(--deep-banner-blue)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--heading-color)' }}>Lecturers</h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Book academic consultations and schedule office hours with university faculty.
            </p>
          </div>

          {userRole === 'student' && (
            <div
              onClick={!isPeerMentor && !registering ? handleRegisterAsPeerMentor : undefined}
              style={{
                ...cardStyle,
                cursor: isPeerMentor ? 'default' : registering ? 'not-allowed' : 'pointer',
                borderColor: isPeerMentor ? '#28a745' : '#e5e7eb',
                background: isPeerMentor ? '#f6fff8' : '#fff',
              }}
              onMouseEnter={(e) => { if (!isPeerMentor) { e.currentTarget.style.borderColor = '#28a745'; e.currentTarget.style.transform = 'translateY(-8px)'; }}}
              onMouseLeave={(e) => { if (!isPeerMentor) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}}
            >
              <div style={{ background: isPeerMentor ? '#e6f9ed' : '#f0f4f8', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
                <Icon icon={isPeerMentor ? "lucide:check-circle-2" : "lucide:hand-helping"} width="40" style={{ color: isPeerMentor ? '#28a745' : 'var(--deep-banner-blue)' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--heading-color)' }}>
                {isPeerMentor ? 'You\'re a Peer Mentor!' : 'Become a Peer Mentor'}
              </h3>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {isPeerMentor
                  ? 'Your Sessions tab is active in the sidebar. Manage your student requests there.'
                  : 'Register to mentor juniors, log hours, and build your leadership portfolio.'}
              </p>
              {!isPeerMentor && (
                <div style={{ marginTop: '20px', background: 'var(--deep-banner-blue)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
                  {registering ? 'Registering...' : 'Register Now'}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MentoringHub;