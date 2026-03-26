import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Landing/Navbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import HowItWorks from './components/Landing/HowItWorks';
import Pricing from './components/Landing/Pricing';
import Team from './components/Landing/Team';
import Footer from './components/Landing/Footer';
import PublicProfile from './components/Landing/PublicProfile';

import Home from './dashboard/Home';
import GroupsPage from './pages/GroupsPage';
import { SocietyProfilePage, EventDetailsPage } from './pages/Event';
import { LeaderDashboard, LeaderEventEditor } from './components/events/Leader/pages/Leader';
import AdminDashboard from './dashboard/AdminDashboard';

import LecturerMentoring from './pages/LecturerMentoring';
import PeerMentoring from './pages/PeerMentoring';
import MentorLogin from './pages/MentorLogin';

const MentoringWrapper = ({ Component }: { Component: any }) => {
  const navigate = useNavigate();
  return <Component onBack={() => navigate('/')} />;
};

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('user_role');
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const [myEventsList, setMyEventsList] = useState<string[]>([]);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  const handleLogin = useCallback((role: string = 'student'): void => {
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_role', role);
    setIsLoggedIn(true);
    setUserRole(role);
    navigate('/'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleLogout = useCallback((): void => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/'); 
  }, [navigate]);

  const handleAddEvent = (eventId: string): void => {
    if (!myEventsList.includes(eventId)) {
      setMyEventsList(prev => [...prev, eventId]);
    }
  };

  const handleRemoveEvent = (eventId: string): void => {
    setMyEventsList(prev => prev.filter(id => id !== eventId));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
          handleLogin(data.user?.role || 'student');
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [API_URL, handleLogin, handleLogout]);

  useEffect(() => {
    if (isLoggedIn || isLoading) return;
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
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return <div className="loading-screen">Loading UniQ...</div>; 
  }

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route 
            path="/" 
            element={
              userRole === 'admin' ? <AdminDashboard /> : 
              userRole === 'society_leader' ? <LeaderDashboard /> : 
              <Home myEventsList={myEventsList} onLogout={handleLogout} userRole={userRole} />
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              userRole === 'admin' ? <AdminDashboard /> : 
              userRole === 'society_leader' ? <LeaderDashboard /> : 
              <Home myEventsList={myEventsList} onLogout={handleLogout} userRole={userRole} />
            } 
          />

          <Route path="/society/:id" element={<SocietyProfilePage />} />
          <Route path="/groups" element={<GroupsPage userRole={userRole} />} />
          <Route path="/profile/:id" element={<PublicProfile />} />

          {userRole === 'society_leader' ? (
            <Route path="/event/:eventId" element={<LeaderEventEditor />} />
          ) : (
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
          )}

          <Route path="/admin/event/:eventId" element={<LeaderEventEditor />} />

          <Route path="/mentoring/lecturers" element={<MentoringWrapper Component={LecturerMentoring} />} />
          <Route path="/mentoring/peers" element={<MentoringWrapper Component={PeerMentoring} />} />
          <Route path="/mentor-auth/:role" element={<MentorLogin />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </>      
      ) : (
        <>
          <Route path="/" element={
            <div className="app-container">
              <Navbar onSignUpSuccess={(role) => handleLogin(role)} />
              <Hero />
              <div className="reveal-on-scroll"><Features /></div>
              <div className="reveal-on-scroll"><HowItWorks /></div>
              <div className="reveal-on-scroll"><Pricing /></div>
              <div className="reveal-on-scroll"><Team /></div>
              <Footer />
            </div>
          } />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;