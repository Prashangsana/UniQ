import React from 'react';
// import './DashboardView.css';

const groupsData = [
  { id: 1, name: 'CS - 97', img: '' },
  { id: 2, name: 'Design Club', img: '' },
  { id: 3, name: 'Robotics', img: '' },
  { id: 4, name: 'AI Research', img: '' },
  { id: 5, name: 'Game Dev', img: '' },
];

const DashboardView = () => {
    return (
       <div className="app-container">
      
      {/* Hero Banner */}
      <header className="hero-banner">
        <div className="qr-code-placeholder">
          <div style={{background: 'white', padding: '8px', borderRadius: '8px'}}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=Ticket" alt="QR" />
          </div>
        </div>
        
        <div className="hero-content">
          <p className="hero-subtitle">Phase 02 tickets available on spotseeker.lk</p>
          <h1 className="event-title">Sally's Manor</h1>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="dashboard-layout">
        
        {/* LEFT COLUMN: Groups */}
        <section className="content-panel groups-panel">
          <div className="section-header">
            <h3>My Groups</h3>
            <button className="see-all">See All &gt;</button>
          </div>
          
          <div className="groups-grid">
            {groupsData.map((group) => (
              <div key={group.id} className="group-card">
                <img src={group.img} alt={group.name} />
                <div className="group-gradient">
                  <span>{group.name}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="view-more-btn">Explore New Groups</button>
        </section>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="content-panel sidebar-panel">
          
          <div className="tiles-grid">
            <button className="tile-btn blue">
              <span className="icon">📅</span> Bookings
            </button>
            <button className="tile-btn blue">
              <span className="icon">👥</span> Community
            </button>
            <button className="tile-btn blue">
              <span className="icon">🏆</span> Rankings
            </button>
            <button className="tile-btn blue">
              <span className="icon">🎟️</span> My Events
            </button>
          </div>

          <div className="register-stack">
            <button className="register-btn">
              <div className="reg-content">
                <span className="reg-title">Register as a Mentor</span>
                <span className="reg-sub">Share your knowledge</span>
              </div>
              <span className="arrow">→</span>
            </button>

            <button className="register-btn">
               <div className="reg-content">
                <span className="reg-title">Register as a Society Leader</span>
                <span className="reg-sub">Lead a society</span>
              </div>
              <span className="arrow">→</span>
            </button>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default DashboardView;