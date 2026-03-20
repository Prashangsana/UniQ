import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Landing Page Components
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import HowItWorks from './components/Landing/HowItWorks';
import Pricing from './components/Landing/Pricing';
import Team from './components/Landing/Team';
import Footer from './components/Landing/Footer';

// Dashboard & Core Pages
import Home from './dashboard/Home';
import DashboardView from './dashboard/DashboardView';
import { SocietyProfilePage, EventDetailsPage } from './pages/Event';

// Mentoring Components
import LecturerMentoring from './pages/LecturerMentoring';
import PeerMentoring from './pages/PeerMentoring';
import MentorLogin from './pages/MentorLogin';


const MentoringWrapper = ({ Component }: { Component: any }) => {
  const navigate = useNavigate();
  return <Component onBack={() => navigate('/')} />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  
  const [myEventsList, setMyEventsList] = useState<string[]>([]);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  const handleLogin = (): void => {
    localStorage.setItem('is_logged_in', 'true');
    setIsLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = (): void => {
    localStorage.removeItem('is_logged_in');
    setIsLoggedIn(false);
  };

  const handleAddEvent = (eventId: string): void => {
    if (!myEventsList.includes(eventId)) {
      setMyEventsList(prev => [...prev, eventId]);
    }
  };

  const handleRemoveEvent = (eventId: string): void => {
    setMyEventsList(prev => prev.filter(id => id !== eventId));
  };

  // Background Auth Check (Main branch logic)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
          handleLogin();
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    };
    checkAuth();
  }, [API_URL]);

  // Scroll animations for Landing Page
  useEffect(() => {
    if (isLoggedIn) return;
    const observerOptions = { root: null, threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          /* Authenticated View: Includes both Main and Mentoring routes */
          <>
            {/* Core Routes */}
            <Route path="/" element={<Home myEventsList={myEventsList} />} />
            <Route path="/dashboard" element={<DashboardView onSeeAll={() => { }} />} />
            <Route path="/society/:id" element={<SocietyProfilePage />} />
            <Route 
              path="/event/:eventId" 
              element={
                <EventDetailsPage 
                  onAddEvent={handleAddEvent} 
                  onRemoveEvent={handleRemoveEvent} 
                  myEventsList={myEventsList as any} 
                />
              } 
            />

            {/* Mentoring Routes (Mapped to your 2 specific files) */}
            <Route 
              path="/mentoring/lecturers" 
              element={<MentoringWrapper Component={LecturerMentoring} />} 
            />
            <Route 
              path="/mentoring/peers" 
              element={<MentoringWrapper Component={PeerMentoring} />} 
            />
            <Route path="/mentor-auth/:role" element={<MentorLogin />} />
          </>
        ) : (
          /* Landing Page View */
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
        
        {/* Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;