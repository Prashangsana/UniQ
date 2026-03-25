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
import PublicProfile from './components/Landing/PublicProfile';

// Dashboard & Core Pages
import Home from './dashboard/Home';
import GroupsPage from './pages/GroupsPage';
import { SocietyProfilePage, EventDetailsPage } from './pages/Event';
import { LeaderDashboard, LeaderEventEditor } from './components/events/Leader/pages/Leader';
import AdminDashboard from './dashboard/AdminDashboard';

// Mentoring Components
import LecturerMentoring from './pages/LecturerMentoring';
import PeerMentoring from './pages/PeerMentoring';
import MentorLogin from './pages/MentorLogin';

const MentoringWrapper = ({ Component }: { Component: any }) => {
  const navigate = useNavigate();
  return <Component onBack={() => navigate('/')} />;
};

function App() {
  // State Management
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('is_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('user_role');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [myEventsList, setMyEventsList] = useState<string[]>([]);
  const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  // Auth Handlers
  const handleLogin = (role: string = 'student'): void => {
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_role', role);
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('is_logged_in');
    localStorage.removeItem('user_role');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const handleAddEvent = (eventId: string): void => {
    if (!myEventsList.includes(eventId)) {
      setMyEventsList(prev => [...prev, eventId]);
    }
  };

  const handleRemoveEvent = (eventId: string): void => {
    setMyEventsList(prev => prev.filter(id => id !== eventId));
  };

  // Authentication Check on Load
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
  }, [API_URL]);

  // Scroll animations for Landing Page
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
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          /* Authenticated View */
          <>
            {/* Default Routes */}
            <Route path="/" element={
              userRole === 'admin' ? <AdminDashboard /> : userRole === 'society_leader' ? <LeaderDashboard /> : <Home myEventsList={myEventsList} />
            } />

            <Route path="/dashboard" element={
              userRole === 'admin' ? <AdminDashboard /> : userRole === 'society_leader' ? <LeaderDashboard /> : <Home myEventsList={myEventsList} />
            } />
            {userRole === 'admin' && (
              <Route path="/admin" element={<AdminDashboard />} />
            )}

            <Route path="/profile/:id" element={<PublicProfile />} />

            <Route path="/groups" element={<GroupsPage />} />

            <Route path="/society/:id" element={<SocietyProfilePage />} />

            {/* Leader Specific Routes */}
            {userRole === 'society_leader' ? (
              <Route path="/event/:eventId" element={<LeaderEventEditor />} />
            ) : (
              <>

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
                <Route path="/admin/event/:eventId" element={<LeaderEventEditor />} />
              </>
            )}

            {/* Mentoring & Auth Routes */}
            <Route path="/mentoring/lecturers" element={<MentoringWrapper Component={LecturerMentoring} />} />
            <Route path="/mentoring/peers" element={<MentoringWrapper Component={PeerMentoring} />} />
            <Route path="/mentor-auth/:role" element={<MentorLogin />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* --- PUBLIC / LANDING PAGE VIEW --- */
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
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

