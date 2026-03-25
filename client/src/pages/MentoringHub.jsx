import React from 'react';
import { Icon } from '@iconify/react';

const MentoringHub = ({ onSelectCategory }) => {
  return (
    <div className="mentoring-layout" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <main className="mentoring-main" style={{ textAlign: 'center', maxWidth: '850px', flex: 'none', background: 'transparent', boxShadow: 'none' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--deep-banner-blue)', marginBottom: '15px' }}>Mentoring Hub</h2>
        <p style={{ color: 'var(--body-text-gray)', fontSize: '1.1rem', marginBottom: '50px' }}>
          Who would you like to connect with today?
        </p>
        
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          {/* Peer Mentor Selection Card */}
          <div 
            onClick={() => onSelectCategory('peer-mentoring')}
            style={{ 
              background: '#fff', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '50px 30px', 
              width: '320px', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
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

          {/* Lecturer Selection Card */}
          <div 
            onClick={() => onSelectCategory('lecturer-mentoring')}
            style={{ 
              background: '#fff', border: '2px solid #e5e7eb', borderRadius: '20px', padding: '50px 30px', 
              width: '320px', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
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

        </div>
      </main>
    </div>
  );
};

export default MentoringHub;