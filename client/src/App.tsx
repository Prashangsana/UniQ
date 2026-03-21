import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Landing Page Components
import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import HowItWorks from './components/Landing/HowItWorks';
import Pricing from './components/Landing/Pricing';
import Team from './components/Landing/Team';
import Footer from './components/Landing/Footer';

// Dashboard Components
import Home from './dashboard/Home';

import { SocietyProfilePage, EventDetailsPage } from './pages/Event';
import { LeaderDashboard, LeaderEventEditor, LeaderSocietyManager } from './components/events/Leader/pages/Leader';

interface Event {
  _id: string;
  title: string;
  date: string;
  society: string;
  bannerImage?: string;
  description: string;
  instagramLink?: string;
  registerLink?: string;
  time: string;
  place: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

interface SavedEvent {
  _id: string;
  user: string;
  event: Event;
  createdAt: string;
  updatedAt: string;
}

function App() {
  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('user_role');
  });
  
  const [myEventsList, setMyEventsList] = useState<SavedEvent[]>([]);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  const fetchMyEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/my`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setMyEventsList(data.data); // data.data is an array of populated SavedEvent objects
      }
    } catch (error) {
      console.error('Error fetching saved events:', error);
    }
  }, [API_URL]);

  // Auth Handlers
  const handleLogin = useCallback((role: string = 'student'): void => {
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_role', role);
    setIsLoggedIn(true);
    setUserRole(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchMyEvents(); // Fetch saved events after login
  }, [fetchMyEvents]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    setIsLoggedIn(false);
    setUserRole(null);
    setMyEventsList([]); // Clear list on logout
  }, []);

  const handleAddEvent = (): void => {
    // Refresh the whole list from the server to keep it in sync
    fetchMyEvents();
  };

  const handleRemoveEvent = (eventId: string): void => {
    setMyEventsList(prev => prev.filter(e => (e.event?._id || e.event) !== eventId));
  };

  // Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Corrected endpoint from /api/auth/me back to /auth/me to match server.js
        const response = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
          handleLogin(data.user?.role || 'student');
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleLogout();
      }
    };
    checkAuth();
  }, [API_URL, handleLogin, handleLogout]);

  // Landing Page Intersection Observer
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
          <>
            {/* Default Routes */}
            <Route path="/" element={
              userRole === 'society_leader' ? <LeaderDashboard /> : <Home myEventsList={myEventsList} />
            } />
            
            <Route path="/dashboard" element={
              userRole === 'society_leader' ? <LeaderDashboard /> : <Home myEventsList={myEventsList} />
            } />

            {/* Shared Routes */}
            <Route path="/society/:id" element={<SocietyProfilePage />} />

            {/* Leader Specific Routes */}
            {userRole === 'society_leader' && (
              <>
                <Route path="/admin/society/:id" element={<LeaderSocietyManager />} />
                <Route path="/admin/event/:eventId" element={<LeaderEventEditor />} />
              </>
            )}

            {/* Dynamic Event Route based on Role */}
            <Route 
              path="/event/:eventId" 
              element={
                userRole === 'society_leader' ? (
                  <LeaderEventEditor />
                ) : (
                  <EventDetailsPage
                    onAddEvent={handleAddEvent}
                    onRemoveEvent={handleRemoveEvent}
                    myEventsList={myEventsList as never}
                  />
                )
              } 
            />

            {/* Catch-all for logged-in users */}
            <Route path="*" element={userRole === 'society_leader' ? <LeaderDashboard /> : <Home myEventsList={myEventsList} />} />
          </>
        ) : (
          <>
            <Route path="/" element={
              <div className="app-container">
                <Navbar onSignUpSuccess={() => handleLogin('student')} />
                <Hero />
                <Features />
                <HowItWorks />
                <Pricing />
                <Team />
                <Footer />
              </div>
            } />
            {/* Catch-all for logged-out users (redirect to landing) */}
            <Route path="*" element={<Home myEventsList={[]} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;