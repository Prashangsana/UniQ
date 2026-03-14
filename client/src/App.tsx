import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MentorLogin from './pages/MentorLogin';

// Component Imports
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import HowItWorks from './components/Landing/HowItWorks';
import Pricing from './components/Landing/Pricing';
import Team from './components/Landing/Team';
import Footer from './components/Landing/Footer';
import Home from './dashboard/Home';
import { SocietyProfilePage, EventDetailsPage } from './pages/Event';
// import Mentoring from './pages/Mentoring';
import DashboardView from './dashboard/DashboardView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myEventsList, setMyEventsList] = useState<string[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEvent = (eventId: string) => {
    setMyEventsList(prev => [...prev, eventId]);
  };

  const handleRemoveEvent = (eventId: string) => {
    setMyEventsList(prev => prev.filter(id => id !== eventId));
  };

  // Scroll observer logic
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          /* Authenticated Routes */
          <>
            <Route path="/" element={<Home myEventsList={myEventsList} />} />
            <Route path="/mentor-auth/:role" element={<MentorLogin />} />
            <Route path="/dashboard" element={<DashboardView onSeeAll={() => { }} />} />
            <Route path="/event/:id" element={
              <EventDetailsPage 
                onAddEvent={handleAddEvent} 
                onRemoveEvent={handleRemoveEvent} 
                myEventsList={myEventsList} 
              />
            } />
            <Route path="/society/:name" element={<SocietyProfilePage />} />
          </>
        ) : (
          /* Public/Landing Routes */
          <Route path="/" element={
            <div className="app-container">
              <Navbar onSignUpSuccess={handleLogin} />
              <Hero />
              <div className="reveal-on-scroll"><Features /></div>
              <div className="reveal-on-scroll"><HowItWorks /></div>
              <div className="reveal-on-scroll"><Pricing /></div>
              <div className="reveal-on-scroll"><Team /></div>
              <Footer />
            </div>
          } />
        )}
        
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;