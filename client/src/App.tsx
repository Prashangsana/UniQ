import { useState, useEffect } from 'react';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  
  const [myEventsList, setMyEventsList] = useState<any[]>([]);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  const handleLogin = (): void => {
    localStorage.setItem('is_logged_in', 'true');
    setIsLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchMyEvents(); // Fetch saved events after login
  };

  const handleLogout = (): void => {
    localStorage.removeItem('is_logged_in');
    setIsLoggedIn(false);
    setMyEventsList([]); // Clear list on logout
  };

  const fetchMyEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/my`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setMyEventsList(data.data); // data.data is an array of populated SavedEvent objects
      }
    } catch (error) {
      console.error('Error fetching saved events:', error);
    }
  };

  const handleAddEvent = (event: any): void => {
    // If it's an object from the backend, it will have { event: { ... } }
    // If it's just the ID, we'll need to fetch the event details to show it in the list
    // For now, let's just refresh the whole list from the server to keep it in sync
    fetchMyEvents();
  };

  const handleRemoveEvent = (eventId: string): void => {
    setMyEventsList(prev => prev.filter(e => (e.event?._id || e.event) !== eventId));
  };

  // Background Auth Check
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

  // LOGGED IN VIEW
  if (isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home myEventsList={myEventsList} />} />
          <Route path="/dashboard" element={<Home myEventsList={myEventsList} />} />
          <Route
            path="/event/:eventId"
            element={
              <EventDetailsPage
                onAddEvent={handleAddEvent}
                onRemoveEvent={handleRemoveEvent}
                myEventsList={myEventsList as never}
              />
            }
          />
          <Route path="/society/:id" element={<SocietyProfilePage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // LANDING PAGE VIEW
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <Navbar onSignUpSuccess={handleLogin} />
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Team />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;